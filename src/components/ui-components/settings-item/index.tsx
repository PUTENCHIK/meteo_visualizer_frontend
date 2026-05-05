import clsx from 'clsx';
import s from './settings-item.module.scss';
import { settingsManager } from '@managers/settings-manager';
import { type SettingsItem as SettingsItemType } from '@utils/settings';
import { RangeInput } from '@components/range-input';
import { Toggle } from '@components/toggle';
import { TabsMenu } from '@components/tabs-menu';
import { TextInput } from '@components/text-input';
import { NumberInput } from '@components/number-input';
import { Select } from '@components/select';

interface SettingsItemProps {
    item: SettingsItemType;
    path: string;
    parentDisabled?: boolean;
}

export const SettingsItem = ({ item, path, parentDisabled = false }: SettingsItemProps) => {
    let component;

    const handleChange = (value: any, finalValue?: boolean) => {
        settingsManager.set(path, value, finalValue);
    };

    let disabled = item.disabled || parentDisabled;
    const visible = item.visible;

    const pathEnable = path.split('.').slice(0, -1).join('.') + '.enable';

    if (visible && settingsManager.get(pathEnable) !== undefined && path !== pathEnable) {
        disabled = disabled || !settingsManager.get(pathEnable);
    }
    const tabs: Record<string, string> = {};

    switch (item.kind) {
        case 'boolean':
            component = (
                <Toggle
                    key={path}
                    value={item.value}
                    onChange={(value) => handleChange(value)}
                    disabled={disabled}
                />
            );
            break;
        case 'number':
            component = (
                <NumberInput
                    key={path}
                    defaultValue={item.value}
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    onChange={handleChange}
                    disabled={disabled}
                />
            );
            break;
        case 'range':
            component = (
                <RangeInput
                    key={path}
                    startValue={item.value}
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    onChange={handleChange}
                    disabled={disabled}
                />
            );
            break;
        case 'string':
            component = (
                <TextInput
                    key={path}
                    defaultValue={item.value}
                    placeholder={item.placeholder}
                    maxLength={item.maxLength}
                    disabled={disabled}
                    onChange={handleChange}
                />
            );
            break;
        case 'color':
            component = (
                <input
                    key={path}
                    type='color'
                    value={item.value}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={disabled}
                />
            );
            break;
        case 'select':
            component = (
                <Select
                    key={path}
                    value={item.value}
                    options={Object.fromEntries(item.options.map((value) => [value, value]))}
                    onChange={handleChange}
                    disabled={disabled}
                />
            );
            break;
        case 'tab':
            Object.entries(item.tabs).map(([key, tab]) => {
                tabs[key] = tab.title;
            });
            component = (
                <div className={clsx(s['settings-tab'])}>
                    <TabsMenu
                        current={item.value}
                        tabs={tabs}
                        onChange={(value) => handleChange(value)}
                        disabled={disabled}
                    />
                    {Object.entries(item.tabs[item.value].content).map(([key, tabItem]) => (
                        <SettingsItem
                            key={key}
                            item={tabItem}
                            path={`${path}.${item.value}.${key}`}
                            parentDisabled={disabled}
                        />
                    ))}
                </div>
            );
            break;
        default:
            component = null;
            break;
    }
    if (visible) {
        if (item.kind === 'chapter') {
            return (
                <div className={clsx(s['settings-chapter'], disabled && s['disabled'])}>
                    <h3>{item.title}</h3>
                    <div className={clsx(s['items-box'])}>
                        {Object.entries(item.items).map(([key, item]) => (
                            <SettingsItem
                                key={key}
                                item={item}
                                path={`${path}.${key}`}
                                parentDisabled={disabled}
                            />
                        ))}
                    </div>
                </div>
            );
        } else {
            return (
                <div className={clsx(s['settings-item'], disabled && s['disabled'])}>
                    {item.kind !== 'tab' && <span>{item.title}:</span>}
                    {component}
                </div>
            );
        }
    } else return null;
};
