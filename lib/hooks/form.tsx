/* eslint-disable react-refresh/only-export-components */
import { lazy } from 'react';
import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './form-context.tsx';

const Input = lazy(() => import('../form/input/Input.tsx'));
const TextArea = lazy(() => import('../form/textarea/TextArea.tsx'));
const Switch = lazy(() => import('../form/switch/Switch.tsx'));

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldComponents: {
        Input,
        TextArea,
        Switch
    },
    formComponents: {},
    fieldContext,
    formContext
});
