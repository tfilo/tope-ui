import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './form-context.tsx';

import DateTimeInput from '../form/date-time-input/DateTimeInput.tsx';
import Input from '../form/input/Input.tsx';
import Select from '../form/select/Select.tsx';
import Switch from '../form/switch/Switch.tsx';
import TextArea from '../form/textarea/TextArea.tsx';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldComponents: {
        DateTimeInput,
        Input,
        TextArea,
        Switch,
        Select
    },
    formComponents: {},
    fieldContext,
    formContext
});
