import {
  ChangeEvent,
  ChangeEventHandler,
  EventHandler,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Button, ButtonType, Input, Link, Paragraph } from "@sovryn/ui";
import { BasePath } from "@sovryn/onboard-hw-common";
import styles from "./DerivationPathForm.module.css";

type DerivationPathForm = {
  value: string;
  onChange: (value: string) => void;
  basePaths: BasePath[];
  loading: boolean;
  error?: string;
};

export const DerivationPathForm: FC<DerivationPathForm> = ({
  value,
  onChange,
  basePaths,
  loading,
  error,
}) => {
  const [selectedPath, setSelectedPath] = useState<string>(value);
  const [customPath, setCustomPath] = useState<string>(value);

  const derivationPath = useMemo(() => {
    if (selectedPath === "custom") {
      return customPath;
    }
    return selectedPath;
  }, [selectedPath, customPath]);

  const handleSelectedPathChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      if (event.target.value !== "custom") {
        // update custom path to the last used path from dropdown
        setCustomPath(event.target.value);
      }
      setSelectedPath(event.target.value);
    },
    []
  );

  const handleCustomChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCustomPath(event.target.value),
    []
  );

  const handleSubmit = useCallback(() => {
    onChange(derivationPath);
  }, [derivationPath, onChange]);

  const options = useMemo(
    () => [
      ...basePaths.map((item) => ({
        value: item.value,
        label: `${item.label} - ${item.value}`,
      })),
      { value: "custom", label: "Custom" },
    ],
    [basePaths]
  );

  return (
    <div className={styles.container}>
      <div>
        <Paragraph className={styles.infoText}>
          Click &quot;Continue&quot; to connect your wallet or add a custom
          derivation path.
        </Paragraph>

        <Paragraph>Derivation path:</Paragraph>
        <select
          value={selectedPath}
          onChange={handleSelectedPathChange}
          className={styles.selectPath}
        >
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {selectedPath === "custom" && (
          <Input
            value={customPath}
            onChange={handleCustomChange}
            className={styles.customPathInput}
          />
        )}

        {error && (
          <Paragraph className={styles.error}>{error.toString()}</Paragraph>
        )}
      </div>

      <div>
        <Button
          text="Continue"
          loading={loading}
          disabled={loading}
          type={ButtonType.submit}
          onClick={handleSubmit}
          className={styles.button}
        />

        <Link
          href="https://wiki.sovryn.app/en/technical-documents/wallet-derivation-paths"
          className={styles.infoLink}
          text="Learn more about derivation paths"
        />
      </div>
    </div>
  );
};
