"use client";

import {
  FormControl,
  InputGroup,
  InputLeftElement,
  InputProps,
  Input as ChakraInput,
  InputRightElement,
  FormErrorMessage,
  FormLabelProps,
  FormLabel,
} from "@chakra-ui/react";
import {
  forwardRef,
  ForwardRefRenderFunction,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
} from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import InputMask from "react-input-mask";

interface IInputProps extends InputProps {
  name: string;
  variant?: string;
  mask?: string;
  iconLeft?: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
  iconRight?:
    | ReactElement<any, string | JSXElementConstructor<any>>
    | undefined;
  error?: FieldError;
  children?: ReactNode;
  maskChar?: string | null;
  label?: string;
  labelProps?: FormLabelProps;
  register?: UseFormRegisterReturn<string>;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  {
    name,
    variant = "primary",
    error = undefined,
    iconLeft = undefined,
    iconRight = undefined,
    mask = null,
    children,
    maskChar,
    label,
    labelProps,
    register,
    ...rest
  },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel
          mb={2}
          {...labelProps}
          color={error ? "red.500" : "brand.primary.500"}
          fontSize={"16px"}
          fontWeight={"400"}
        >
          {label}
        </FormLabel>
      )}
      <InputGroup>
        {iconLeft && <InputLeftElement h="100%">{iconLeft}</InputLeftElement>}
        <ChakraInput
          variant={variant}
          borderColor={error ? "red.500" : "none"}
          paddingInlineStart={iconLeft ? "4rem" : "4"}
          paddingInlineEnd={iconRight ? "4rem" : "4"}
          id={name}
          as={mask ? InputMask : ChakraInput}
          mask={mask}
          _hover={{ borderColor: error ? "red.600" : "none" }}
          {...(mask ? { maskChar: maskChar } : {})}
          {...rest}
          {...register}
          ref={ref}
        />
        {children}
        {iconRight && (
          <InputRightElement h="100%">{iconRight}</InputRightElement>
        )}
      </InputGroup>
      {error && (
        <FormErrorMessage mt={1} mb={4}>
          * {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};

export const Input = forwardRef(InputBase);
