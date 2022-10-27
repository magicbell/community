import SearchIcon from '@heroicons/react/outline/SearchIcon';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import FormSubmitter from '../FormSubmitter';
import SearchBoxShortcut from './SearchBoxShortcut';

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
          <div className="relative w-full text-gray-400 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
              <SearchIcon className="h-5 w-5" />
            </div>
            <Field
              id="search-field"
              className="block h-full w-full border-transparent md:py-2 py-4 pl-8 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
              placeholder="Quick search"
              name="query"
              autoComplete="off"
            />
          </div>
          <SearchBoxShortcut />
          <FormSubmitter formik={formik} />
        </Form>
      )}
    </Formik>
  );
}
