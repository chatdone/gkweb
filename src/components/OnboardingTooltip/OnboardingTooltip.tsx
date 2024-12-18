import { gql, useMutation } from '@apollo/client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  ShepherdOptionsWithType,
  ShepherdTour,
  ShepherdTourContext,
} from 'react-shepherd';
import 'shepherd.js/dist/css/shepherd.css';

import {
  initialSteps, // editCompanySteps,
  // addCompanyMembersSteps,
  // addCompanyTeamSteps,
  // editCompanyTeamSteps,
  // setupPaymentDetailsSteps,
  // subscriptPackageSteps,
  // addContactGroupSteps,
  // addContactSteps, // contactGroupSelectSteps,
  // assignContactGroupForContactSteps,
  // viewContactDetailSteps,
  // addInternalTaskBoardSteps,
  // addTaskBoardTeamSteps,
  // addTaskSteps,
  // editTaskSteps,
  // taskViewModeSteps,
  // taskSharedWithMeSteps,
  // addClientCollectorSteps,
  // createCollectionSteps,
  // viewCollectionSteps,
  // collectionListViewTypeAndStatusSortingSteps,
  // paymentsPageSteps,
  // ganttChartSteps,
  // attendanceClockInSteps,
  // attendanceDetailsSteps,
  // createProjectSteps,
  // createProjectTaskSteps,
  // addProjectTeamSteps,
  // editProjectTaskSteps,
  // companyPolicySteps,
  // companyHolidaySteps,
  // companyLocationSteps,
  // companyActivityLabelSteps,
  // createEmployeeTypeSteps,
  // editEmployeeTypeSteps,
  // setCompanyMemberEmployeeTypeSteps,
  // companySelectLocationSteps,
  // companyAddLocationSteps,
  // addTaskStepsWithTemplate,
} from './steps';

import { useAppStore } from '@/stores/useAppStore';
import { usePageLoadStore } from '@/stores/usePageLoadStore';

import Configs from '@/configs';

import { OnboardingType, OnboardingRangeType } from '@/types';

import {
  UpdateUserOnboardingMutation,
  UpdateUserOnboardingMutationVariables,
} from 'generated/graphql-types';

type OnboardingStep = {
  type: OnboardingType;
  steps: ShepherdOptionsWithType[];
  nextOnboardingType?: OnboardingType;
  disabledRunNextOnboardingTypeImmediately?: boolean;
  disableModalOverlay?: boolean;
};

type OnboardingRange = {
  type: OnboardingRangeType;
  start: OnboardingType;
  end: OnboardingType;
  isSettingsPage?: boolean;
};

type StartTourProps = {
  onCancel: () => void;
  onComplete: () => void;
  steps: ShepherdOptionsWithType[];
};

const StartTour = ({
  onCancel,
  onComplete,
  steps,
}: StartTourProps): JSX.Element => {
  const ctx = useContext(ShepherdTourContext);

  const { currentUser } = useAppStore();

  useEffect(() => {
    const keyEvent = (key: any) => {
      if (key.code === 'Escape') {
        ctx?.cancel();
      }
    };

    if (Configs.env.DEBUG_ONBOARDING_TOOLTIP) {
      window.addEventListener('keydown', keyEvent);
    }

    return () => {
      if (Configs.env.DEBUG_ONBOARDING_TOOLTIP) {
        window.removeEventListener('keydown', keyEvent);
      }
    };
  }, []);

  useEffect(() => {
    if (steps && steps.length > 0) {
      if (!ctx?.isActive()) {
        ctx?.start();
        ctx?.on('cancel', onCancel);
        ctx?.on('complete', onComplete);

        return () => {
          ctx?.off('cancel', onCancel);
          ctx?.off('complete', onComplete);
        };
      }
    }
  }, [currentUser, steps]);

  return <></>;
};

type OnBoardingTooltipProps = {
  children?: JSX.Element[] | JSX.Element | undefined;
};

const onboardingSteps: OnboardingStep[] = [
  {
    type: OnboardingType.INITIAL,
    steps: initialSteps,
    nextOnboardingType: OnboardingType.EDIT_COMPANY,
  },
  {
    type: OnboardingType.NONE,
    steps: [],
  },
];

const OnboardingTooltip = ({
  children,
}: OnBoardingTooltipProps): JSX.Element => {
  const { currentUser, reloadUser } = useAppStore();

  const onboardingType = useRef<OnboardingType>(OnboardingType.INITIAL);
  const [steps, setSteps] = useState<ShepherdOptionsWithType[]>([]);

  const { isPageLoading } = usePageLoadStore();

  const [mutateUpdateUserOnboarding] = useMutation<
    UpdateUserOnboardingMutation,
    UpdateUserOnboardingMutationVariables
  >(updateUserOnboarding);

  useEffect(() => {
    const keyEvent = (key: any) => {
      if (key.code === 'Backquote') {
        startTour(OnboardingType.INITIAL);
      } else if (key.code === 'Digit1') {
        console.log(steps, OnboardingType[onboardingType.current.valueOf()]);
      }
    };

    if (Configs.env.DEBUG_ONBOARDING_TOOLTIP) {
      window.addEventListener('keydown', keyEvent);
    }

    return () => {
      if (Configs.env.DEBUG_ONBOARDING_TOOLTIP) {
        window.removeEventListener('keydown', keyEvent);
      }
    };
  }, [steps]);

  // Show tooltip when user just loaded the page
  useEffect(() => {
    const isHomePage = window.location.pathname.includes('home');

    //Show when user has not completed tutorial and home page is loaded
    if (
      isHomePage &&
      currentUser &&
      !currentUser?.onboarding?.hasCompletedTutorial &&
      !isPageLoading
    ) {
      setTimeout(() => {
        startTour(OnboardingType.INITIAL);
      }, 1500);
    }
  }, [currentUser, isPageLoading]);

  const getCurrentTour = () => {
    if (onboardingType.current === OnboardingType.NONE) {
      return [];
    }

    return onboardingSteps.find((onboardingStep) => {
      return onboardingStep.type === onboardingType.current;
    });
  };

  const handleCancel = () => {
    exitTour();
  };

  const handleComplete = () => {
    completeTour();
  };

  const exitTour = async () => {
    startTour(OnboardingType.NONE);

    try {
      if (currentUser && !currentUser?.onboarding?.hasCompletedTutorial) {
        await mutateUpdateUserOnboarding({
          variables: {
            payload: {
              hasCompletedTutorial: true,
            },
          },
        });
        await reloadUser();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const completeTour = () => {
    const onBoardingTypeData = onboardingSteps.find((onboardingStep) => {
      return onboardingStep.type === onboardingType.current;
    });

    if (
      onBoardingTypeData?.nextOnboardingType === OnboardingType.NONE ||
      !onBoardingTypeData?.nextOnboardingType
    ) {
      exitTour();
    }
  };

  const startTour = (newOnboardingType: OnboardingType) => {
    onboardingType.current = newOnboardingType;

    const newSteps = (getCurrentTour() as OnboardingStep)?.steps || [];

    if (newSteps.length === 0) {
      onboardingType.current = OnboardingType.NONE;
    }

    setSteps(newSteps);
  };

  return (
    <TourContext.Provider
      value={{
        startTour,
      }}
    >
      <ShepherdTour
        tourOptions={{
          useModalOverlay: true,
          keyboardNavigation: false,
        }}
        steps={steps}
      >
        <StartTour
          steps={steps}
          onCancel={handleCancel}
          onComplete={handleComplete}
        />
        {children}
      </ShepherdTour>
    </TourContext.Provider>
  );
};

export default OnboardingTooltip;

export const updateUserOnboarding = gql`
  mutation UpdateUserOnboarding($payload: JSON) {
    updateUserOnboarding(payload: $payload) {
      id
    }
  }
`;

type TourConfig = {
  startTour?: ((onboardingType: OnboardingType) => void) | null;
};

const TourContext = createContext<TourConfig>({
  startTour: null,
});

const useTourContext = () => useContext(TourContext);

export { useTourContext, TourContext };
