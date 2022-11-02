import { useEffect, useState } from 'react';

interface Props {
  formik?: any;
  onChange?: () => void;
}

export default function FormSubmitter({ formik, onChange }: Props) {
  const [lastValues, updateState] = useState(formik?.values);

  useEffect(() => {
    const valuesEqualLastValues = lastValues === formik?.values;
    const valuesEqualInitialValues = formik?.values === formik?.initialValues;

    if (!valuesEqualLastValues) {
      updateState(formik?.values);
    }

    if (!valuesEqualLastValues && !valuesEqualInitialValues) {
      formik?.submitForm();
    }
  }, [lastValues, formik?.values, formik?.initialValues, onChange, formik]);

  return null;
}
