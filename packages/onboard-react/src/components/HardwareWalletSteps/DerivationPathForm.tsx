import { ChangeEvent, FC, useCallback, useMemo, useState } from 'react';

import { BasePath } from '@sovryn/onboard-hw-common';
import {
  Button,
  ButtonType,
  Input,
  Link,
  Paragraph,
  Select,
  FormGroup,
  ButtonStyle,
  InputSize,
  HelperButton,
} from '@sovryn/ui';

import styles from './DerivationPathForm.module.css';

type DerivationPathFormProps = {
  value: string;
  onChange: (value: string) => void;
  basePaths: BasePath[];
  loading: boolean;
  error?: string;
  dataAttribute?: string;
};

export const DerivationPathForm: FC<DerivationPathFormProps> = ({
  value,
  onChange,
  basePaths,
  loading,
  error,
  dataAttribute,
}) => {
  const [selectedPath, setSelectedPath] = useState(value);
  const [customPath, setCustomPath] = useState(value);

  const derivationPath = useMemo(() => {
    if (selectedPath === 'custom') {
      return customPath;
    }
    return selectedPath;
  }, [selectedPath, customPath]);

  const handleSelectedPathChange = useCallback((value: string) => {
    if (value !== 'custom') {
      // update custom path to the last used path from dropdown
      setCustomPath(value);
    }
    setSelectedPath(value);
  }, []);

  const handleCustomChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setCustomPath(event.target.value),
    [],
  );

  const handleSubmit = useCallback(() => {
    onChange(derivationPath);
  }, [derivationPath, onChange]);

  const options = useMemo(
    () => [
      ...basePaths.map(item => ({
        value: item.value,
        label: `${item.label} - ${item.value}`,
      })),
      { value: 'custom', label: 'Custom' },
    ],
    [basePaths],
  );

  return (
    <div className={styles.container}>
      <div>
        <Paragraph className={styles.infoText}>
          Click &quot;Continue&quot; to connect your wallet or add a custom
          derivation path.
        </Paragraph>

        <FormGroup
          label="Derivation path:"
          dataAttribute={`${dataAttribute}-derivation-path`}
          errorLabel={error ? error.toString() : undefined}
          helper={
            <HelperButton
              content={
                <Paragraph>
                  New to this term?{' '}
                  <Link
                    href="https://wiki.sovryn.app/en/technical-documents/wallet-derivation-paths"
                    text="See the wiki"
                  />
                </Paragraph>
              }
            />
          }
        >
          <Select
            value={selectedPath}
            onChange={handleSelectedPathChange}
            options={options}
            dropdownProps={{ usePortal: false, className: styles.dropdown }}
          />

          {selectedPath === 'custom' && (
            <Input
              value={customPath}
              placeholder="m/0'/0'/0'/0"
              onChange={handleCustomChange}
              className={styles.customPathInput}
              size={InputSize.large}
              invalid={!!error}
            />
          )}
        </FormGroup>
      </div>

      <div>
        <Button
          text="Continue"
          loading={loading}
          disabled={loading || !derivationPath}
          type={ButtonType.submit}
          style={ButtonStyle.secondary}
          onClick={handleSubmit}
          className={styles.button}
          dataAttribute={`${dataAttribute}-derivation-confirm`}
        />
        {loading && (
          <Paragraph className={styles.loadingText}>
            Scanning wallet addresses, please wait.
          </Paragraph>
        )}

        <Link
          href="https://wiki.sovryn.app/en/getting-started/direct-hardware-wallet-integrations"
          className={styles.infoLink}
          text="Learn how to setup your hardware wallet"
          dataAttribute={`${dataAttribute}-derivation-info`}
        />
      </div>
    </div>
  );
};
