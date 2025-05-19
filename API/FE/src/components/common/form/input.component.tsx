import { useController } from "react-hook-form";
import  Select  from "react-select";
export interface InputLabelProps {
  children: any;
  htmlFor: string;
}

export const InputLabel = ({ children, htmlFor }: InputLabelProps) => {
  return <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-900 mb-2">{children}</label>;
};

export interface TextInputInterface {
  control: any;
  name: string;
  defaultValue?: string | undefined;
  errMsg?: string | null;
  type?: string;
  row?: number;
}

export const TextInputComponent = ({
  control,
  name,
  defaultValue,
  errMsg = null ,
  type = "text",
}: TextInputInterface) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
    rules: {
      required: true, // Example rule
    },
  });

  return (
    <>
      <input
        type={type}
        {...field}
        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
      />
      {errMsg && <span className="text-sm italic text-red-800">{errMsg}</span>}
    </>
  );
};

export interface TextAreaInputInterface {
  control: any;
  name: string;
  defaultValue?: string | undefined;
  errMsg?: string | null;
  row?: number;
}

export const TextAreaInputComponent = ({
  control,
  name,
  defaultValue,
  errMsg = null,
  row = 5,
}: TextAreaInputInterface) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
    rules: {
      required: true, // Example rule
    },
  });

  return (
    <>
      <textarea
        rows={row}
        style={{ resize: "none" }}
        {...field}
        className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
      />
      {errMsg && <span className="text-sm italic text-red-800">{errMsg}</span>}
    </>
  );
};

export interface OptionType {
  label: string;
  value: string;
}

export interface SelectOptionProps {
  control: any;
  name: string;
  errMsg: string;
  options?: OptionType[];
}

export const SelectComponent = ({
  options,
  control,
  name,
  errMsg = "",
}: SelectOptionProps) => {
  const { field } = useController({
    name,
    control,
    rules: {
      required: true, // Example rule
    },
  });

  return (
    <>
    <Select options={options} {...field} isClearable  />
      
      {errMsg && <span className="text-sm italic text-red-800">{errMsg}</span>}
    </>
  );
};

export const RoleSelectComponent = ({ control, name, errMsg }: SelectOptionProps) => {
  return (
    <SelectComponent
      options={[
        { label: "admin", value: "admin" },
        { label: "member", value: "member" },
      ]}
      control={control}
      name={name}
      errMsg={errMsg}
    />
  );
};

export const StatusSelectComponent = ({ control, name, errMsg=""}: SelectOptionProps) => {
        return(<>
        <SelectComponent
         options={[
        { label: "Publish", value: "active" },
        { label: "Unpublish", value: "inactive" }
      ]}
      control={control}
      name={name}
      errMsg={errMsg}
    />
        </>)
}

export const SubmitButton = ({loading=false, children} :{loading:boolean, children:any}) =>{
    return(<>
    <button disabled={loading}
              type="submit"
              className="mr-2 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-800 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
            >
             {children}
            </button>
            </>)
}

export const CancelButton = ({loading=false, children} :{loading:boolean, children:any}) =>{
    return(<>
    <button disabled={loading}
              type="reset"
              className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-teal-800 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-teal-800"
            >
             {children}
            </button>
            </>)
}