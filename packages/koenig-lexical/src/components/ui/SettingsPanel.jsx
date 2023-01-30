import React from 'react';
import {Toggle} from './Toggle';
import {Input} from './Input';
import useMovable from '../../hooks/useMovable';

export function SettingsPanel() {
    const {ref} = useMovable({adjustOnResize: true});
    return (
        <div className="not-kg-prose z-[9999999] m-0 w-[320px] flex-col overflow-y-auto rounded-lg bg-white bg-clip-padding font-sans shadow"
            ref={ref}
        >
            <ToggleSetting label='Loop' description='Autoplay your video on a loop without sound.' />
            <InputSetting label='Button title' value='' placeholder='Add button text' />
        </div>
    );
}

export function ToggleSetting({label, description}) {
    return (
        <div className="border-b-grey-200 flex w-full items-center justify-between border-b p-6 text-[1.3rem] last-of-type:border-b-0">
            <div>
                <div className="text-grey-900 font-bold">{label}</div>
                {description &&
                    <p className="text-grey-700 text-[1.25rem] font-normal leading-snug">{description}</p>
                }
            </div>
            <div className="shrink-0 pl-2">
                <Toggle />
            </div>
        </div>
    );
}

export function InputSetting({label, description, value, placeholder}) {
    return (
        <div className="border-b-grey-200 flex w-full flex-col justify-between gap-2 border-b p-6 text-[1.3rem] last-of-type:border-b-0">
            <div className="text-grey-900 font-bold">{label}</div>
            <Input value={value} placeholder={placeholder} />
            {description &&
                    <p className="text-grey-700 text-[1.25rem] font-normal leading-snug">{description}</p>
            }
        </div>
    );
}