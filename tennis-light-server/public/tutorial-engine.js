(function initializeTutorialEngine(globalScope) {
  "use strict";

  const SCHEMA_VERSION = 1;
  const TRANSIENT_DEFAULTS = Object.freeze({
    active: false,
    autoCompletedIds: [],
    selectedCardUid: null,
    error: null,
    scrolledStepId: null,
    pendingAutoStepId: null,
  });

  function uniqueStrings(values, limit = 100) {
    return [...new Set((Array.isArray(values) ? values : [])
      .map((value) => String(value || "").trim())
      .filter(Boolean))].slice(0, limit);
  }

  function moduleKeys(modules) {
    return Object.keys(modules && typeof modules === "object" ? modules : {});
  }

  function moduleEntry(modules, moduleReference) {
    if (!modules || typeof modules !== "object" || moduleReference == null) return null;
    const reference = String(moduleReference);
    if (modules[reference]) return [reference, modules[reference]];
    return Object.entries(modules).find(([, module]) => String(module?.id || "") === reference) ?? null;
  }

  function moduleFor(modules, moduleReference) {
    return moduleEntry(modules, moduleReference)?.[1] ?? null;
  }

  function stableModuleId(modules, moduleReference) {
    const entry = moduleEntry(modules, moduleReference);
    return entry ? String(entry[1].id || entry[0]) : null;
  }

  function stepIndexFor(module, tutorialState) {
    if (!module?.steps?.length) return -1;
    if (tutorialState?.stepId) {
      const stableIndex = module.steps.findIndex((step) => step.id === tutorialState.stepId);
      if (stableIndex >= 0) return stableIndex;
    }
    const legacyIndex = Number(tutorialState?.stepIndex);
    return Number.isInteger(legacyIndex) && legacyIndex >= 0 && legacyIndex < module.steps.length ? legacyIndex : 0;
  }

  function stateForStep(tutorialState, module, stepIndex) {
    const safeIndex = Math.max(0, Math.min(Number(stepIndex) || 0, Math.max(0, (module?.steps?.length || 1) - 1)));
    return {
      ...tutorialState,
      stepId: module?.steps?.[safeIndex]?.id ?? null,
      stepIndex: safeIndex,
    };
  }

  function createState(input = {}, modules = null) {
    const source = input && typeof input === "object" ? input : {};
    const keys = moduleKeys(modules);
    const requestedModuleId = source.moduleId == null ? null : String(source.moduleId);
    const fallbackModuleId = keys.length ? stableModuleId(modules, keys[0]) : null;
    const moduleId = stableModuleId(modules, requestedModuleId) ?? fallbackModuleId ?? requestedModuleId;
    const academyCompleted = Boolean(source.academyCompleted ?? source.completed);
    const completedModules = uniqueStrings(source.completedModules)
      .map((completedModuleId) => stableModuleId(modules, completedModuleId) ?? completedModuleId);
    const base = {
      schemaVersion: SCHEMA_VERSION,
      moduleId,
      stepId: source.stepId == null ? null : String(source.stepId),
      stepIndex: Math.max(0, Number.isInteger(Number(source.stepIndex)) ? Number(source.stepIndex) : 0),
      completedModules: uniqueStrings(completedModules),
      academyCompleted,
      completed: academyCompleted,
      ...TRANSIENT_DEFAULTS,
      active: Boolean(source.active),
      autoCompletedIds: uniqueStrings(source.autoCompletedIds, 500),
      selectedCardUid: source.selectedCardUid == null ? null : String(source.selectedCardUid),
      error: source.error == null ? null : String(source.error),
      scrolledStepId: source.scrolledStepId == null ? null : String(source.scrolledStepId),
      pendingAutoStepId: source.pendingAutoStepId == null ? null : String(source.pendingAutoStepId),
    };
    const module = moduleFor(modules, moduleId);
    return module ? stateForStep(base, module, stepIndexFor(module, base)) : base;
  }

  function snapshot(tutorialState = {}) {
    return {
      schemaVersion: SCHEMA_VERSION,
      moduleId: tutorialState.moduleId ?? null,
      stepId: tutorialState.stepId ?? null,
      completedModules: uniqueStrings(tutorialState.completedModules),
      academyCompleted: Boolean(tutorialState.academyCompleted ?? tutorialState.completed),
    };
  }

  function restore(savedProgress, modules) {
    const saved = savedProgress && typeof savedProgress === "object" ? savedProgress : {};
    return createState({ ...saved, active: false }, modules);
  }

  function deactivate(tutorialState, modules) {
    return createState({
      ...tutorialState,
      ...TRANSIENT_DEFAULTS,
      active: false,
    }, modules);
  }

  function start(tutorialState, modules, moduleId, options = {}) {
    const module = moduleFor(modules, moduleId);
    if (!module) throw new Error(`Module de tutoriel inconnu : ${moduleId}`);
    const canonicalModuleId = stableModuleId(modules, moduleId);
    const requestedStepId = options.stepId == null ? null : String(options.stepId);
    const requestedIndex = requestedStepId
      ? module.steps.findIndex((step) => step.id === requestedStepId)
      : 0;
    if (requestedStepId && requestedIndex < 0) {
      throw new Error(`Étape de tutoriel inconnue : ${moduleId}/${requestedStepId}`);
    }
    const next = createState({
      ...tutorialState,
      moduleId: canonicalModuleId,
      stepId: requestedStepId,
      stepIndex: Math.max(0, requestedIndex),
      active: true,
      autoCompletedIds: [],
      selectedCardUid: null,
      error: null,
      scrolledStepId: null,
      pendingAutoStepId: null,
    }, modules);
    return stateForStep(next, module, Math.max(0, requestedIndex));
  }

  function currentModule(tutorialState, modules) {
    return moduleFor(modules, tutorialState?.moduleId);
  }

  function currentStep(tutorialState, modules) {
    if (!tutorialState?.active) return null;
    const module = currentModule(tutorialState, modules);
    const index = stepIndexFor(module, tutorialState);
    return index >= 0 ? module.steps[index] ?? null : null;
  }

  function expectedValidation(tutorialState, modules) {
    const step = currentStep(tutorialState, modules);
    return step?.validation ?? step?.action ?? null;
  }

  function valuesEqual(expected, actual) {
    if (Array.isArray(expected)) {
      return Array.isArray(actual)
        && expected.length === actual.length
        && expected.every((value, index) => valuesEqual(value, actual[index]));
    }
    if (expected && typeof expected === "object") {
      if (!actual || typeof actual !== "object") return false;
      return Object.entries(expected).every(([key, value]) => valuesEqual(value, actual[key]));
    }
    return expected === actual;
  }

  function validationMatches(expected, event) {
    if (!expected) return false;
    if (Array.isArray(expected)) return expected.some((candidate) => validationMatches(candidate, event));
    const ignoredMetadata = new Set(["requiresSelection", "error", "message", "label"]);
    const comparable = Object.fromEntries(Object.entries(expected).filter(([key]) => !ignoredMetadata.has(key)));
    return valuesEqual(comparable, event);
  }

  function advance(tutorialState, modules) {
    const module = currentModule(tutorialState, modules);
    if (!tutorialState?.active || !module) return createState(tutorialState, modules);
    const currentIndex = stepIndexFor(module, tutorialState);
    if (currentIndex < 0 || currentIndex + 1 >= module.steps.length) return createState(tutorialState, modules);
    return stateForStep({
      ...tutorialState,
      error: null,
      selectedCardUid: null,
      pendingAutoStepId: null,
    }, module, currentIndex + 1);
  }

  function validateAndAdvance(tutorialState, modules, event) {
    const expected = expectedValidation(tutorialState, modules);
    if (!validationMatches(expected, event)) {
      return { matched: false, state: createState(tutorialState, modules) };
    }
    return { matched: true, state: advance(tutorialState, modules) };
  }

  function completeModule(tutorialState, modules, options = {}) {
    const moduleId = tutorialState?.moduleId;
    const module = moduleFor(modules, moduleId);
    if (!module) return createState(tutorialState, modules);
    const currentIndex = stepIndexFor(module, tutorialState);
    if (tutorialState?.active && currentIndex !== module.steps.length - 1) {
      return createState(tutorialState, modules);
    }
    const canonicalModuleId = stableModuleId(modules, moduleId);
    const academyCompleted = Boolean(options.academyCompleted ?? tutorialState.academyCompleted ?? tutorialState.completed);
    return deactivate({
      ...tutorialState,
      completedModules: uniqueStrings([...(tutorialState.completedModules ?? []), canonicalModuleId]),
      academyCompleted,
      completed: academyCompleted,
    }, modules);
  }

  function resetProgress(modules, moduleId = moduleKeys(modules)[0] ?? null) {
    return createState({ moduleId }, modules);
  }

  function validateModules(modules) {
    const errors = [];
    const seenModuleIds = new Set();
    for (const [moduleKey, module] of Object.entries(modules && typeof modules === "object" ? modules : {})) {
      if (!module || typeof module !== "object") {
        errors.push(`${moduleKey}: définition de module absente`);
        continue;
      }
      if (!String(module.id || "").trim()) errors.push(`${moduleKey}: identifiant stable manquant`);
      if (seenModuleIds.has(module.id)) errors.push(`${moduleKey}: identifiant de module dupliqué (${module.id})`);
      seenModuleIds.add(module.id);
      if (!Array.isArray(module.steps) || !module.steps.length) {
        errors.push(`${moduleKey}: aucune étape`);
        continue;
      }
      const seenStepIds = new Set();
      module.steps.forEach((step, index) => {
        const stepId = String(step?.id || "").trim();
        if (!stepId) errors.push(`${moduleKey}: identifiant manquant pour l'étape ${index + 1}`);
        if (seenStepIds.has(stepId)) errors.push(`${moduleKey}: identifiant d'étape dupliqué (${stepId})`);
        seenStepIds.add(stepId);
      });
    }
    if (!moduleKeys(modules).length) errors.push("Aucun module de tutoriel déclaré");
    return errors;
  }

  function assertValidModules(modules) {
    const errors = validateModules(modules);
    if (errors.length) throw new Error(`Configuration du tutoriel invalide :\n- ${errors.join("\n- ")}`);
    return true;
  }

  globalScope.TennisCourtsTutorialEngine = Object.freeze({
    SCHEMA_VERSION,
    createState,
    snapshot,
    restore,
    deactivate,
    start,
    stableModuleId,
    currentModule,
    currentStep,
    expectedValidation,
    validationMatches,
    advance,
    validateAndAdvance,
    completeModule,
    resetProgress,
    validateModules,
    assertValidModules,
  });
}(typeof window !== "undefined" ? window : globalThis));
