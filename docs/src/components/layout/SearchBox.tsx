import SearchIcon from '@heroicons/react/outline/SearchIcon';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import FormSubmitter from '../FormSubmitter';
import SearchBoxShortcut from './SearchBoxShortcut';
import { Input } from '@darkmagic/react';

interface Props {
  onSubmit: (query: string) => void;
}

export default function SearchBox({ onSubmit }: Props) {
  const handleSubmit = ({ query }: { query: string }) => {
    onSubmit(query);
  };

  return (
    <Formik onSubmit={handleSubmit} initialValues={{ query: '' }}>
      {(formik) => (
        <Form className="w-full flex items-center">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full text-gray-700 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ml-2">
              <SearchIcon className="h-5 w-5" />
            </div>
            <Field
              id="search-field"
              placeholder="Quick search"
              name="query"
              autoComplete="off"
              as={Input}
            />
          </div>
          <SearchBoxShortcut />
          <FormSubmitter formik={formik} />
        </Form>
      )}
    </Formik>
  );
}
