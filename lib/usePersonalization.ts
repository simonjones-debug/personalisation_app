import { useCallback, useMemo } from "react";
import { useNinetailed } from "@ninetailed/experience.js-next";

export type UsePersonalizationOptions = {
  uid?: string;
  debug?: boolean;
};

export type EventName =
  | "page_view"
  | "cta_click"
  | "signup_start"
  | "signup_complete"
  | "purchase"
  | "feature_used"
  | "log_component_viewed"
  | "observe_component_viewed"
  | "unobserve_component_viewed";

export function usePersonalization<TTraits extends Record<string, unknown> = Record<string, unknown>>(
  options: UsePersonalizationOptions = {}
) {
  const {
    identify,
    profileState,
    track,
    page,
    reset,
    onProfileChange: onProfileChangeInternal,
    trackComponentView,
    observeElement,
    unobserveElement,
    debug,
  } = useNinetailed();

  const getUid = useCallback(() => {
    return options.uid ?? (profileState as any)?.profile?.id ?? "local-dev";
  }, [options.uid, profileState]);

  //traits
  const setTraits = useCallback(
    async (traits: Partial<TTraits>) => {
      await identify(getUid(), traits as any);
    },
    [identify, getUid]
  );

  const getTrait = useCallback(
    <K extends keyof TTraits>(traitKey: K): TTraits[K] | undefined => {
      const traits = (profileState as any)?.profile?.traits as TTraits | undefined;
      return traits?.[traitKey];
    },
    [profileState]
  );

  //events - further re-eval extensibility effectiveness of this approach
  const useEvent = useCallback(
    async (eventName: EventName, properties?: Record<string, any>) => {
      switch (eventName) {
        case "page_view":
          await page(properties);
          return;
        case "observe_component_viewed": {
          const { element } = (properties || {}) as { element: Element };
          if (element) {
            observeElement({ element } as any);
            return;
          }
          break;
        }
        case "unobserve_component_viewed": {
          const { element } = (properties || {}) as { element: Element };
          if (element) {
            unobserveElement(element);
            return;
          }
          break;
        }
        case "log_component_viewed": {
          const { element, experience, variant, audience, variantIndex } = (properties || {}) as {
            element: Element;
            experience?: any;
            variant?: any;
            audience?: any;
            variantIndex?: number;
          };
          if (element) {
            await trackComponentView({ element, experience, variant, audience, variantIndex } as any);
            return;
          }
          // fall through to default when element is missing
        }
        default:
          await track(eventName, properties);
          return;
      }
    },
    [track, page, trackComponentView]
  );

  //profile
  const getProfileState = useCallback(() => profileState, [profileState]);
  
  const resetProfile = useCallback(async () => {
    await reset();
  }, [reset]);

  const onProfileChange = useCallback(
    (cb: (profile: any) => void) => {
      const off = onProfileChangeInternal(cb);
      return typeof off === "function" ? off : () => {};
    },
    [onProfileChangeInternal]
  );  

  //debugging and observation
  const enableDebug = useCallback(() => debug(true), [debug]);
  const disableDebug = useCallback(() => debug(false), [debug]);

  return useMemo(
    () => ({
      setTraits,
      getTrait,
      useEvent,
      getProfileState,
      onProfileChange,
      resetProfile,
      enableDebug,
      disableDebug,
    }),
    [
      setTraits,
      getTrait,
      useEvent,
      getProfileState,
      onProfileChange,
      resetProfile,
      enableDebug,
      disableDebug,
    ]
  );
}


