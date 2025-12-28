type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    startAction?: React.ElementType;
    endAction?: React.ElementType;
};

export const Input: React.FC<InputProps> = (props) => {
    return (
        <div className='group'>
            <label>Test</label>
            <div className='border has-disabled:border-light has-hover:border-dark has-focus:border-dark rounded-sm min-h-[34px] flex flex-row'>
                <input className='w-full focus:outline-0 px-md' {...props} />
            </div>
            <label className='text-danger text-sm'>Error</label>
        </div>
    );
};
