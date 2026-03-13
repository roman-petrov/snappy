/* eslint-disable react-hooks/exhaustive-deps */
import { _ } from "@snappy/core";
import { SnappyCore, type SnappyCoreOptions } from "@snappy/snappy-core";
import { useSignalState } from "@snappy/ui";
import { useEffect } from "preact/hooks";

import { api, t } from "./core";
import { useIsMobile } from "./hooks/useMediaQuery";

export const useDashboardState = () => {
  const [options, setOptions] = useSignalState<SnappyCoreOptions>(SnappyCore.defaultOptions);
  const [text, setText] = useSignalState(``);
  const [result, setResult] = useSignalState(``);
  const [error, setError] = useSignalState(``);
  const [loading, setLoading] = useSignalState(false);
  const [copied, setCopied] = useSignalState(false);
  const [isEditMode, setIsEditMode] = useSignalState(true);
  const mobile = useIsMobile();

  useEffect(() => {
    void (async () => {
      const response = await api.remaining(``);

      setOptions(response.options);
    })();
  }, []);

  const processText = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(``);
    setResult(``);
    if (text.trim() === ``) {
      return;
    }
    setLoading(true);
    const processResult = await api.process(``, text.trim(), options);
    setLoading(false);
    if (processResult.status !== `ok`) {
      setError(t(`dashboard.errors.${processResult.status}`));

      return;
    }
    setResult(processResult.text);
    setCopied(false);
    setIsEditMode(false);
  };

  const switchToEdit = () => setIsEditMode(true);

  const clear = () => {
    setText(``);
    setResult(``);
    setError(``);
    setIsEditMode(true);
  };

  const copyResult = () => {
    void navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), _.second * 2);

      return undefined;
    });
  };

  const updateOption = <K extends keyof SnappyCoreOptions>(key: K, value: SnappyCoreOptions[K]) => {
    setOptions(previous => ({ ...previous, [key]: value }));
  };

  const showResult = !isEditMode && result !== ``;
  const sectionClassKey: `sectionDesktop` | `sectionMobile` = mobile ? `sectionMobile` : `sectionDesktop`;
  const { lengthEmoji, lengthKeys, styleEmoji, styleKeys } = SnappyCore;

  const lengthOptions = mobile
    ? lengthKeys.map(key => ({ label: lengthEmoji[key], value: key }))
    : lengthKeys.map(key => ({ label: `${lengthEmoji[key]} ${t(`options.length.${key}`)}`, value: key }));

  const styleOptions = mobile
    ? styleKeys.map(key => ({ label: t(`options.style.short.${key}`), value: key }))
    : styleKeys.map(key => ({ label: `${styleEmoji[key]} ${t(`options.style.${key}`)}`, value: key }));

  const addEmojiButtonClassKeys: `toggleBtnEmoji`[] = options.addEmoji === true ? ([`toggleBtnEmoji`] as const) : [];

  const addFormattingButtonClassKeys: `toggleBtnFormat`[] =
    options.addFormatting === true ? ([`toggleBtnFormat`] as const) : [];

  const submitButtonText = loading ? t(`dashboard.submitting`) : t(`dashboard.submit`);
  const actionEditLabel = t(`dashboard.actionEdit`);
  const actionNewLabel = t(`dashboard.actionNew`);
  const addEmojiLabel = t(`options.addEmoji`);
  const addFormattingLabel = t(`options.addFormatting`);
  const lengthLabel = t(`options.length.label`);
  const styleLabel = t(`options.style.label`);
  const copyLabel = copied ? t(`dashboard.copied`) : t(`dashboard.copy`);
  const showError = error !== ``;
  const processButtonDisabled = loading || text.trim() === ``;
  const processButtonDisabledEmpty = !loading && text.trim() === ``;

  return {
    actionEditLabel,
    actionNewLabel,
    addEmojiBtnClassKeys: addEmojiButtonClassKeys,
    addEmojiLabel,
    addFormattingBtnClassKeys: addFormattingButtonClassKeys,
    addFormattingLabel,
    copied,
    errorText: error,
    lengthLabel,
    lengthOptions,
    loading,
    mobile,
    onClear: clear,
    onCopyResult: copyResult,
    onLengthChange: (value: string) => {
      const found = lengthKeys.find(key => key === value);

      updateOption(`length`, found ?? options.length ?? `keep`);
    },
    onOptionChange: updateOption,
    onStyleChange: (value: string) => {
      const found = styleKeys.find(key => key === value);

      updateOption(`style`, found ?? options.style ?? `neutral`);
    },
    onSubmit: processText,
    onSwitchToEdit: switchToEdit,
    onTextChange: setText,
    options,
    processButtonDisabled,
    processButtonDisabledEmpty,
    result,
    sectionClassKey,
    showError,
    showResult,
    styleLabel,
    styleOptions,
    submitButtonText,
    text,
    toolbarButtonCopyTitle: copyLabel,
    toolbarButtonFull: !mobile,
    toolbarButtonIcon: copied ? `✓` : `📋`,
    toolbarButtonLabel: mobile ? undefined : copyLabel,
  };
};
