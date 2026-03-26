import type { Meta, StoryObj } from '@storybook/react-vite';

import { Section } from './Section';
import { expect } from 'storybook/test';

const meta = {
    title: 'Layout/Section',
    component: Section,
    tags: ['autodocs'],
    argTypes: {
        children: {
            control: 'text'
        },
        title: {
            control: 'text'
        },
        titleType: {
            control: 'select',
            options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        }
    }
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText('Test title').tagName).toBe('H2');
        await expect(canvas.getByText('Lorem ipsum dolor sit amet cons', { exact: false }).tagName).toBe('DIV');
    },
    args: {
        title: 'Test title',
        children:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum quibusdam perferendis vitae, magni veniam facilis optio corrupti aspernatur sit, nihil culpa eveniet, accusamus deserunt libero modi ex dolores cupiditate quis harum accusantium necessitatibus architecto. Similique nam aperiam hic cupiditate corrupti modi, sint quos dolorum magnam omnis at dolor aspernatur, quod natus placeat consequuntur esse reiciendis laborum ex sapiente quam eum doloribus? Illum, maxime numquam provident exercitationem dolorem necessitatibus est quae eaque repellat repudiandae laboriosam magni, recusandae placeat autem voluptatum dolorum, quia iure ducimus culpa soluta. Voluptate, quasi sed dolorem molestias facilis error pariatur itaque, similique, vel veritatis maiores cum! Soluta doloremque nihil error voluptatum officia aut. Debitis magni ullam sed officiis pariatur repellat, minus exercitationem assumenda excepturi quis consequatur facilis, animi praesentium architecto inventore laborum voluptate maiores ipsa harum? Error, cupiditate totam reiciendis blanditiis voluptate ipsa ea, ab, voluptas dolore perspiciatis fugit harum. Voluptas similique corporis, commodi natus consectetur molestias neque quaerat quos. Asperiores, eum. Blanditiis est, explicabo pariatur a vero voluptates quae similique ab, voluptatum mollitia natus modi consequuntur consequatur laborum deserunt necessitatibus sunt voluptatem facilis magni esse qui? Quod eaque temporibus adipisci distinctio saepe similique dignissimos ipsum obcaecati reprehenderit ab quaerat cum perspiciatis harum corrupti ratione neque amet, praesentium, quam eligendi facilis molestias cumque. Voluptatibus quisquam laudantium totam labore quae commodi nobis, velit illum ea, ipsam optio? At delectus explicabo labore? Sunt assumenda obcaecati, libero unde, minus accusamus aut doloremque quaerat odio dolor dolorum praesentium nihil quasi laborum commodi maiores esse, consectetur modi. Assumenda illo accusantium, provident, harum quasi nostrum libero ad et minima adipisci placeat magni ullam esse quos nam architecto, blanditiis laboriosam similique vel? Eveniet voluptas a omnis quisquam amet? Impedit, maxime tempora! Nihil alias totam rerum sapiente harum doloremque corporis ipsa deleniti doloribus quaerat, numquam voluptatem eveniet pariatur quas magnam, facere voluptas et. Eius, asperiores molestias, rerum aut voluptatum quod sint praesentium magni soluta, a maiores totam atque molestiae quae cumque aspernatur. Mollitia vero alias doloremque quas molestiae totam dignissimos quam quo, eos dolorum esse aperiam nisi explicabo eaque a provident placeat doloribus neque veritatis optio temporibus deleniti officia. Debitis, veniam explicabo? Maxime distinctio velit blanditiis quibusdam aperiam quasi perspiciatis, molestiae nisi, ipsum quidem nemo. Harum, officia dignissimos in rem vitae ex, iusto natus unde ipsa recusandae omnis, adipisci rerum reprehenderit quidem. Earum, modi, aperiam non rem sapiente sint dignissimos mollitia nobis natus voluptate cum amet voluptatum. Asperiores voluptates dicta accusantium, numquam natus necessitatibus iusto est officia ab eligendi, laboriosam, exercitationem itaque nulla a quidem. Minus veritatis minima sit deleniti architecto quos, vero veniam delectus pariatur et eos excepturi dignissimos debitis repudiandae, consequuntur labore nobis, adipisci suscipit recusandae distinctio perferendis dolor. Dicta quisquam explicabo maxime, beatae autem numquam vitae expedita molestias, accusantium perferendis ad quia eius eligendi facere et dolorum debitis ratione nostrum! Atque, et ratione maxime eius modi provident adipisci, nesciunt quibusdam similique laboriosam rerum dolores repellat recusandae dolore itaque voluptatum voluptates dignissimos expedita alias fugiat? Tempora, maiores delectus. Ipsum sunt fuga blanditiis quisquam optio suscipit corporis ullam omnis ipsa deleniti veniam dolor et autem, quibusdam, laudantium repellat reiciendis soluta dicta unde fugiat nisi? Sunt cumque dolor adipisci ullam sed ex, dolores aperiam ratione quas? Sint, in. Hic nostrum temporibus obcaecati sunt culpa ratione quaerat dolore sint placeat. Aliquid, tempora minima? Rem pariatur commodi, porro atque ullam nobis cupiditate? Repellendus dolorem, inventore quod aperiam, quas vitae, natus omnis dolore mollitia quia iure iusto fuga veniam. Nesciunt incidunt enim, praesentium in ut sit ducimus omnis eos, non dignissimos adipisci, ad velit debitis labore quo iste nostrum totam aliquid? Quaerat itaque voluptatibus, quod beatae aliquid ipsam facere doloremque tempore ullam. Commodi, beatae minus laudantium mollitia illo numquam sapiente vitae est, delectus esse, expedita voluptate rerum corporis pariatur magni! Consequuntur aspernatur libero placeat sint voluptas laboriosam omnis maxime iure tempora facilis, magnam est totam mollitia reprehenderit porro atque eaque odit cupiditate voluptatibus iste dicta! Ipsam veniam in maiores temporibus? Molestias asperiores voluptatem vitae ratione. Accusamus a repudiandae repellendus iusto nisi aliquid quae nulla tempore esse necessitatibus, ducimus assumenda libero ipsam tempora quia maiores doloremque dolorem repellat unde debitis, quasi eveniet eligendi? Repudiandae, consequatur in. Reprehenderit, harum repudiandae! Ducimus accusamus a odit quam cum, illum sint hic placeat officiis consequuntur amet laudantium illo fugit cupiditate alias incidunt blanditiis fuga dicta porro inventore vitae laborum voluptas veniam aliquam. Consectetur voluptate porro velit nulla fugit nam amet quasi vero doloribus, nemo omnis incidunt cum fuga consequatur mollitia! Fugit eum sapiente fugiat rerum cum cumque, vero aperiam! Temporibus voluptates ipsam autem iste facilis minima, tenetur ipsa provident dolores in dignissimos molestias reiciendis, voluptatibus illo? Soluta, non consequuntur! Voluptatum, cum. Quibusdam, odio dignissimos suscipit saepe cumque ipsum sapiente quia sunt debitis ex, possimus animi dolorem natus doloremque quos aspernatur commodi. Repudiandae, laudantium vitae voluptatum earum distinctio nisi obcaecati animi harum quia, suscipit temporibus nesciunt vel et quibusdam similique ducimus alias veniam expedita? Minima, vel quisquam dolore optio consequatur impedit placeat perferendis et atque doloremque in quidem neque, qui voluptatum dolorum quibusdam ex distinctio aliquid tempore amet beatae suscipit dolorem! Molestiae velit quam earum quidem praesentium? Consequuntur a similique eligendi, debitis quidem dolore corporis aspernatur. Eaque, reiciendis consequatur eum quo facere in laboriosam ipsam asperiores cumque ducimus fugiat quam blanditiis nobis sequi quidem provident. Est ipsa sunt voluptas quis natus nemo nostrum minima? Libero fugiat atque excepturi laboriosam maiores voluptatum amet, quidem aliquid consequatur autem incidunt fuga ratione ipsam doloremque deleniti accusamus veritatis quo quae. Explicabo minima dignissimos earum, commodi nihil tempore, aspernatur officia ipsa, rerum quos repellendus asperiores magnam quasi corporis. Doloribus optio sequi sed iste adipisci dolorum delectus veritatis ea, dolor fugiat culpa ipsam rem iure ut deleniti. Fugiat nemo, aperiam ab corrupti tempore laborum neque provident? Voluptatum distinctio saepe aspernatur fugiat incidunt, aliquam eveniet qui? Nam commodi ratione distinctio quasi impedit explicabo ex possimus quidem minus eius corporis praesentium, tempora ipsa mollitia consectetur! Ratione repellendus saepe inventore doloremque? Quis a molestias nemo minus provident dolor dolorem nisi illo reiciendis. Dicta quaerat animi exercitationem quo recusandae molestias fugit, expedita quibusdam odio aspernatur ducimus vero, ad autem, amet minima beatae vitae voluptate!'
    }
};

export const WithoutBorder: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText('Test title').tagName).toBe('H4');
        await expect(canvas.getByText('Lorem ipsum dolor sit amet cons', { exact: false }).tagName).toBe('DIV');
    },
    args: {
        title: Default.args?.title,
        titleType: 'h4',
        children: Default.args?.children,
        hasBorder: false
    }
};

export const SectionInSection: Story = {
    args: {
        title: 'Main section',
        children: (
            <Section title='Sub section'>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam eveniet et facere consequatur porro atque, veniam eum.
                Dolorum, perspiciatis maxime.
                <Section title='Sub Sub section 1'>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam eveniet et facere consequatur porro atque, veniam eum.
                    Dolorum, perspiciatis maxime.
                </Section>
                <Section
                    title='Sub Sub section 2'
                    hasBorder={false}
                >
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam eveniet et facere consequatur porro atque, veniam eum.
                    Dolorum, perspiciatis maxime.
                    <Section
                        title='Sub Sub Sub section'
                        hasBorder={false}
                    >
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam eveniet et facere consequatur porro atque, veniam
                        eum. Dolorum, perspiciatis maxime.
                    </Section>
                </Section>
                <Section
                    title='Sub Sub section 3'
                    hasBorder={false}
                >
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam eveniet et facere consequatur porro atque, veniam eum.
                    Dolorum, perspiciatis maxime.
                </Section>
            </Section>
        )
    }
};
