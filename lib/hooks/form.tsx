import { createFormHook } from '@tanstack/react-form';

import { fieldContext, formContext } from './form-context.tsx';

import { Autocomplete } from '../form/autocomplete/Autocomplete.tsx';
import { DateTimeInput } from '../form/date-time-input/DateTimeInput.tsx';
import { FileInput } from '../form/file-input/FileInput.tsx';
import { Input } from '../form/input/Input.tsx';
import { Select } from '../form/select/Select.tsx';
import { Switch } from '../form/switch/Switch.tsx';
import { TextArea } from '../form/textarea/TextArea.tsx';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
    fieldComponents: {
        Autocomplete,
        DateTimeInput,
        FileInput,
        Input,
        Select,
        Switch,
        TextArea
    },
    formComponents: {},
    fieldContext,
    formContext
});
