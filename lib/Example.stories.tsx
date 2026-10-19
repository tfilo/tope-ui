import type { Meta, StoryObj } from '@storybook/react-vite';
import { Column, Content, Flex, Grid, Header, Page, Section } from './layout';
import { fn } from 'storybook/test';
import { useAppForm } from './hooks';
import type { OnSearchResult } from './form/autocomplete/Autocomplete.types';
import type { Option } from './common';

const meta = {
    title: 'Example',
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const titlesBefore = [
    { label: 'Bc.', value: 'Bc.' },
    { label: 'Bc. art.', value: 'Bc. art.' },
    { label: 'Mgr.', value: 'Mgr.' },
    { label: 'Mgr. art.', value: 'Mgr. art.' },
    { label: 'Ing.', value: 'Ing.' },
    { label: 'Ing. arch.', value: 'Ing. arch.' },
    { label: 'JUDr.', value: 'JUDr.' },
    { label: 'PhDr.', value: 'PhDr.' },
    { label: 'RNDr.', value: 'RNDr.' },
    { label: 'PaedDr.', value: 'PaedDr.' },
    { label: 'PharmDr.', value: 'PharmDr.' },
    { label: 'ThDr.', value: 'ThDr.' },
    { label: 'RSDr.', value: 'RSDr.' },
    { label: 'RCDr.', value: 'RCDr.' },
    { label: 'MUDr.', value: 'MUDr.' },
    { label: 'MDDr.', value: 'MDDr.' },
    { label: 'MVDr.', value: 'MVDr.' },
    { label: 'ThLic.', value: 'ThLic.' },
    { label: 'doc.', value: 'doc.' },
    { label: 'prof.', value: 'prof.' },
    { label: 'dr. h. c.', value: 'dr. h. c.' },
    { label: 'akad.', value: 'akad.' }
];

const titlesAfter = [
    { label: 'PhD.', value: 'PhD.' },
    { label: 'ArtD.', value: 'ArtD.' },
    { label: 'CSc.', value: 'CSc.' },
    { label: 'DrSc.', value: 'DrSc.' },
    { label: 'DiS.', value: 'DiS.' },
    { label: 'DiS. art.', value: 'DiS. art.' },
    { label: 'MBA', value: 'MBA' },
    { label: 'MPH', value: 'MPH' },
    { label: 'LL.M.', value: 'LL.M.' },
    { label: 'MSc.', value: 'MSc.' },
    { label: 'MA', value: 'MA' },
    { label: 'BBA', value: 'BBA' },
    { label: 'DBA', value: 'DBA' },
    { label: 'MPA', value: 'MPA' },
    { label: 'MHA', value: 'MHA' },
    { label: 'MIM', value: 'MIM' },
    { label: 'EMBA', value: 'EMBA' },
    { label: 'MSW', value: 'MSW' },
    { label: 'MBBS', value: 'MBBS' },
    { label: 'FEBS', value: 'FEBS' },
    { label: 'FRCS', value: 'FRCS' }
];

const countries = [
    { label: 'Afghanistan', value: 'AF' },
    { label: 'Albania', value: 'AL' },
    { label: 'Algeria', value: 'DZ' },
    { label: 'Andorra', value: 'AD' },
    { label: 'Angola', value: 'AO' },
    { label: 'Antigua and Barbuda', value: 'AG' },
    { label: 'Argentina', value: 'AR' },
    { label: 'Armenia', value: 'AM' },
    { label: 'Australia', value: 'AU' },
    { label: 'Austria', value: 'AT' },
    { label: 'Azerbaijan', value: 'AZ' },
    { label: 'Bahamas', value: 'BS' },
    { label: 'Bahrain', value: 'BH' },
    { label: 'Bangladesh', value: 'BD' },
    { label: 'Barbados', value: 'BB' },
    { label: 'Belarus', value: 'BY' },
    { label: 'Belgium', value: 'BE' },
    { label: 'Belize', value: 'BZ' },
    { label: 'Benin', value: 'BJ' },
    { label: 'Bhutan', value: 'BT' },
    { label: 'Bolivia', value: 'BO' },
    { label: 'Bosnia and Herzegovina', value: 'BA' },
    { label: 'Botswana', value: 'BW' },
    { label: 'Brazil', value: 'BR' },
    { label: 'Brunei', value: 'BN' },
    { label: 'Bulgaria', value: 'BG' },
    { label: 'Burkina Faso', value: 'BF' },
    { label: 'Burundi', value: 'BI' },
    { label: 'Cabo Verde', value: 'CV' },
    { label: 'Cambodia', value: 'KH' },
    { label: 'Cameroon', value: 'CM' },
    { label: 'Canada', value: 'CA' },
    { label: 'Central African Republic', value: 'CF' },
    { label: 'Chad', value: 'TD' },
    { label: 'Chile', value: 'CL' },
    { label: 'China', value: 'CN' },
    { label: 'Colombia', value: 'CO' },
    { label: 'Comoros', value: 'KM' },
    { label: 'Congo', value: 'CG' },
    { label: 'Costa Rica', value: 'CR' },
    { label: "Côte d'Ivoire", value: 'CI' },
    { label: 'Croatia', value: 'HR' },
    { label: 'Cuba', value: 'CU' },
    { label: 'Cyprus', value: 'CY' },
    { label: 'Czechia', value: 'CZ' },
    { label: 'Democratic Republic of the Congo', value: 'CD' },
    { label: 'Denmark', value: 'DK' },
    { label: 'Djibouti', value: 'DJ' },
    { label: 'Dominica', value: 'DM' },
    { label: 'Dominican Republic', value: 'DO' },
    { label: 'Ecuador', value: 'EC' },
    { label: 'Egypt', value: 'EG' },
    { label: 'El Salvador', value: 'SV' },
    { label: 'Equatorial Guinea', value: 'GQ' },
    { label: 'Eritrea', value: 'ER' },
    { label: 'Estonia', value: 'EE' },
    { label: 'Eswatini', value: 'SZ' },
    { label: 'Ethiopia', value: 'ET' },
    { label: 'Fiji', value: 'FJ' },
    { label: 'Finland', value: 'FI' },
    { label: 'France', value: 'FR' },
    { label: 'Gabon', value: 'GA' },
    { label: 'Gambia', value: 'GM' },
    { label: 'Georgia', value: 'GE' },
    { label: 'Germany', value: 'DE' },
    { label: 'Ghana', value: 'GH' },
    { label: 'Greece', value: 'GR' },
    { label: 'Grenada', value: 'GD' },
    { label: 'Guatemala', value: 'GT' },
    { label: 'Guinea', value: 'GN' },
    { label: 'Guinea-Bissau', value: 'GW' },
    { label: 'Guyana', value: 'GY' },
    { label: 'Haiti', value: 'HT' },
    { label: 'Honduras', value: 'HN' },
    { label: 'Hungary', value: 'HU' },
    { label: 'Iceland', value: 'IS' },
    { label: 'India', value: 'IN' },
    { label: 'Indonesia', value: 'ID' },
    { label: 'Iran', value: 'IR' },
    { label: 'Iraq', value: 'IQ' },
    { label: 'Ireland', value: 'IE' },
    { label: 'Israel', value: 'IL' },
    { label: 'Italy', value: 'IT' },
    { label: 'Jamaica', value: 'JM' },
    { label: 'Japan', value: 'JP' },
    { label: 'Jordan', value: 'JO' },
    { label: 'Kazakhstan', value: 'KZ' },
    { label: 'Kenya', value: 'KE' },
    { label: 'Kiribati', value: 'KI' },
    { label: 'Kuwait', value: 'KW' },
    { label: 'Kyrgyzstan', value: 'KG' },
    { label: 'Laos', value: 'LA' },
    { label: 'Latvia', value: 'LV' },
    { label: 'Lebanon', value: 'LB' },
    { label: 'Lesotho', value: 'LS' },
    { label: 'Liberia', value: 'LR' },
    { label: 'Libya', value: 'LY' },
    { label: 'Liechtenstein', value: 'LI' },
    { label: 'Lithuania', value: 'LT' },
    { label: 'Luxembourg', value: 'LU' },
    { label: 'Madagascar', value: 'MG' },
    { label: 'Malawi', value: 'MW' },
    { label: 'Malaysia', value: 'MY' },
    { label: 'Maldives', value: 'MV' },
    { label: 'Mali', value: 'ML' },
    { label: 'Malta', value: 'MT' },
    { label: 'Marshall Islands', value: 'MH' },
    { label: 'Mauritania', value: 'MR' },
    { label: 'Mauritius', value: 'MU' },
    { label: 'Mexico', value: 'MX' },
    { label: 'Micronesia', value: 'FM' },
    { label: 'Moldova', value: 'MD' },
    { label: 'Monaco', value: 'MC' },
    { label: 'Mongolia', value: 'MN' },
    { label: 'Montenegro', value: 'ME' },
    { label: 'Morocco', value: 'MA' },
    { label: 'Mozambique', value: 'MZ' },
    { label: 'Myanmar', value: 'MM' },
    { label: 'Namibia', value: 'NA' },
    { label: 'Nauru', value: 'NR' },
    { label: 'Nepal', value: 'NP' },
    { label: 'Netherlands', value: 'NL' },
    { label: 'New Zealand', value: 'NZ' },
    { label: 'Nicaragua', value: 'NI' },
    { label: 'Niger', value: 'NE' },
    { label: 'Nigeria', value: 'NG' },
    { label: 'North Korea', value: 'KP' },
    { label: 'North Macedonia', value: 'MK' },
    { label: 'Norway', value: 'NO' },
    { label: 'Oman', value: 'OM' },
    { label: 'Pakistan', value: 'PK' },
    { label: 'Palau', value: 'PW' },
    { label: 'Panama', value: 'PA' },
    { label: 'Papua New Guinea', value: 'PG' },
    { label: 'Paraguay', value: 'PY' },
    { label: 'Peru', value: 'PE' },
    { label: 'Philippines', value: 'PH' },
    { label: 'Poland', value: 'PL' },
    { label: 'Portugal', value: 'PT' },
    { label: 'Qatar', value: 'QA' },
    { label: 'Romania', value: 'RO' },
    { label: 'Russia', value: 'RU' },
    { label: 'Rwanda', value: 'RW' },
    { label: 'Saint Kitts and Nevis', value: 'KN' },
    { label: 'Saint Lucia', value: 'LC' },
    { label: 'Saint Vincent and the Grenadines', value: 'VC' },
    { label: 'Samoa', value: 'WS' },
    { label: 'San Marino', value: 'SM' },
    { label: 'Sao Tome and Principe', value: 'ST' },
    { label: 'Saudi Arabia', value: 'SA' },
    { label: 'Senegal', value: 'SN' },
    { label: 'Serbia', value: 'RS' },
    { label: 'Seychelles', value: 'SC' },
    { label: 'Sierra Leone', value: 'SL' },
    { label: 'Singapore', value: 'SG' },
    { label: 'Slovakia', value: 'SK' },
    { label: 'Slovenia', value: 'SI' },
    { label: 'Solomon Islands', value: 'SB' },
    { label: 'Somalia', value: 'SO' },
    { label: 'South Africa', value: 'ZA' },
    { label: 'South Korea', value: 'KR' },
    { label: 'South Sudan', value: 'SS' },
    { label: 'Spain', value: 'ES' },
    { label: 'Sri Lanka', value: 'LK' },
    { label: 'Sudan', value: 'SD' },
    { label: 'Suriname', value: 'SR' },
    { label: 'Sweden', value: 'SE' },
    { label: 'Switzerland', value: 'CH' },
    { label: 'Syria', value: 'SY' },
    { label: 'Tajikistan', value: 'TJ' },
    { label: 'Tanzania', value: 'TZ' },
    { label: 'Thailand', value: 'TH' },
    { label: 'Timor-Leste', value: 'TL' },
    { label: 'Togo', value: 'TG' },
    { label: 'Tonga', value: 'TO' },
    { label: 'Trinidad and Tobago', value: 'TT' },
    { label: 'Tunisia', value: 'TN' },
    { label: 'Turkey', value: 'TR' },
    { label: 'Turkmenistan', value: 'TM' },
    { label: 'Tuvalu', value: 'TV' },
    { label: 'Uganda', value: 'UG' },
    { label: 'Ukraine', value: 'UA' },
    { label: 'United Arab Emirates', value: 'AE' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'United States', value: 'US' },
    { label: 'Uruguay', value: 'UY' },
    { label: 'Uzbekistan', value: 'UZ' },
    { label: 'Vanuatu', value: 'VU' },
    { label: 'Venezuela', value: 'VE' },
    { label: 'Vietnam', value: 'VN' },
    { label: 'Yemen', value: 'YE' },
    { label: 'Zambia', value: 'ZM' },
    { label: 'Zimbabwe', value: 'ZW' }
] as const;

const onSearch = async (query: string, page: number, pageSize: number) => {
    return new Promise<OnSearchResult>((resolve) => {
        setTimeout(
            () => {
                const filteredOptions = countries.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
                resolve({
                    options: filteredOptions.slice(page * pageSize, page * pageSize + pageSize),
                    hasNextPage: filteredOptions.length > (page + 1) * pageSize,
                    page: page
                });
            },
            Math.round(Math.random() * 1000) + 100
        ); // Simulate network delay
    });
};
const onFetch = async (value: string) => {
    return new Promise<Option | null>((resolve) => {
        setTimeout(
            () => {
                resolve(countries.find((option) => option.value === value) || null);
            },
            Math.round(Math.random() * 500) + 10
        ); // Simulate network delay
    });
};

export const Example: Story = {
    render: () => {
        const form = useAppForm({
            defaultValues: {
                titleBefore: '',
                name: '',
                surname: '',
                titleAfter: '',
                dateOfBirth: '',
                address: {
                    street: '',
                    buildingNumber: '',
                    country: '',
                    zip: ''
                },
                subscribe: false,
                email: '',
                note: '',
                attachment: null as File | File[] | null
            },
            onSubmit: ({ value }) => {
                alert(JSON.stringify(value, null, 2));
            }
        });

        return (
            <div className='flex flex-col overflow-hidden'>
                <Header onLogout={fn()} />
                <Content>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') e.preventDefault();
                        }}
                        noValidate
                    >
                        <Page title='Example page'>
                            <Grid maxRows={4}>
                                <Column>
                                    <form.AppField
                                        name='titleBefore'
                                        children={(field) => (
                                            <field.Select
                                                label='Title before'
                                                options={titlesBefore}
                                            />
                                        )}
                                    />
                                </Column>
                                <Column colspan={2}>
                                    <Grid maxRows={2}>
                                        <Column>
                                            <form.AppField
                                                name='name'
                                                children={(field) => <field.Input label='First name' />}
                                            />
                                        </Column>
                                        <Column>
                                            <form.AppField
                                                name='surname'
                                                children={(field) => <field.Input label='Last name' />}
                                            />
                                        </Column>
                                    </Grid>
                                </Column>
                                <Column>
                                    <form.AppField
                                        name='titleAfter'
                                        children={(field) => (
                                            <field.Select
                                                label='Title after'
                                                options={titlesAfter}
                                            />
                                        )}
                                    />
                                </Column>
                            </Grid>
                            <Grid>
                                <Column>
                                    <form.AppField
                                        name='dateOfBirth'
                                        children={(field) => <field.DateTimeInput label='Date of birth' />}
                                    />
                                </Column>
                            </Grid>
                            <Section title='Address'>
                                <Grid maxRows={1}>
                                    <Column>
                                        <form.AppField
                                            name='address.street'
                                            children={(field) => <field.Input label='Street' />}
                                        />
                                    </Column>
                                    <Column>
                                        <form.AppField
                                            name='address.buildingNumber'
                                            children={(field) => <field.Input label='Building number' />}
                                        />
                                    </Column>
                                    <Column>
                                        <form.AppField
                                            name='address.country'
                                            children={(field) => (
                                                <field.Autocomplete
                                                    label='Country'
                                                    onSearch={onSearch}
                                                    onFetch={onFetch}
                                                />
                                            )}
                                        />
                                    </Column>
                                    <Column>
                                        <form.AppField
                                            name='address.zip'
                                            children={(field) => (
                                                <field.Input
                                                    label='Zip'
                                                    type='number'
                                                />
                                            )}
                                        />
                                    </Column>
                                </Grid>
                            </Section>
                            <form.AppField
                                name='subscribe'
                                children={(field) => <field.Switch label='Subscribe' />}
                            />
                            <form.Subscribe selector={(state) => state.values.subscribe}>
                                {(subscribe) =>
                                    subscribe ? (
                                        <Grid>
                                            <Column>
                                                <form.AppField
                                                    name='email'
                                                    children={(field) => (
                                                        <field.Input
                                                            label='Email to subscribe'
                                                            type='email'
                                                        />
                                                    )}
                                                    listeners={{
                                                        onUnmount: () => {
                                                            form.resetField('email');
                                                        }
                                                    }}
                                                />
                                            </Column>
                                        </Grid>
                                    ) : null
                                }
                            </form.Subscribe>
                            <form.AppField
                                name='note'
                                children={(field) => <field.TextArea label='Note' />}
                            />
                            <form.AppField
                                name='attachment'
                                children={(field) => <field.FileInput label='Attachment' />}
                            />
                            <Flex>
                                <form.AppForm>
                                    <form.SubscribeButton>Submit</form.SubscribeButton>
                                </form.AppForm>
                                <form.AppForm>
                                    <form.ResetButton>Reset</form.ResetButton>
                                </form.AppForm>
                            </Flex>
                        </Page>
                    </form>
                </Content>
            </div>
        );
    }
};
