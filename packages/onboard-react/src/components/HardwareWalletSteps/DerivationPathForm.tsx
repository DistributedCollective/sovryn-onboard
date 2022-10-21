import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { Button, ButtonType, Input, Paragraph } from "@sovryn/ui";
import { BasePath } from "@sovryn/onboard-hw-common";

type DerivationPathForm = {
  value: string;
  onChange: (value: string) => void;
  basePaths: BasePath[];
};

export const DerivationPathForm: FC<DerivationPathForm> = ({
  value,
  onChange,
  basePaths,
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

  return (
    <div>
      <Paragraph>
        Click "Continue" to connect your wallet or add a custom derivation path
      </Paragraph>

      <select onChange={handleSelectedPathChange}>
        {basePaths.map((path) => (
          <option value={path.value} key={path.value}>
            {path.label} ({path.value})
          </option>
        ))}
        <option value="custom">Custom</option>
      </select>
      {selectedPath === "custom" && (
        <Input value={customPath} onChange={handleCustomChange} />
      )}
      <Button text="Continue" type={ButtonType.submit} onClick={handleSubmit} />
    </div>
  );
};
