import { useEffect, useState } from 'react';

import { Wing, EventMessage, BaseState } from '../wings';

function useWing<T extends BaseState, C extends Wing<T>>(controller: C): [T, C] {
  const [state, setState] = useState<T>(controller.getState());

  useEffect(() => {
    const listener = ({ event, payload: { currentState } }: EventMessage<T>) => {
      if (event === 'UPDATE') {
        setState(currentState);
      }
    };

    controller.subscribe(listener);

    return () => {
      controller.unsubscribe(listener);
    };
  }, [controller]);

  return [state, controller];
}

export { useWing };
