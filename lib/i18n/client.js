'use client';
import React, {createContext, useContext, useMemo} from 'react';
import NextLink from 'next/link';
import NextImage from 'next/image';
import {createDictTranslator} from './translate.js';
import {localePath, localeInfo} from './config.js';

const Context = createContext({locale: 'en', dir: 'ltr', t: createDictTranslator({}), complete: true, published: true, machine: false});
const Protected = createContext(false);

export function LocaleProvider({locale, dict, complete = true, published = true, machine = false, children}) {
  const value = useMemo(() => ({locale, dir: localeInfo(locale).dir, t: createDictTranslator(dict || {}), complete, published, machine}),
    [locale, dict, complete, published, machine]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useI18n = () => useContext(Context);

const textProps = ['alt', 'title', 'placeholder', 'aria-label', 'aria-description', 'aria-valuetext'];
function propsFor(props, t) {
  const out = {...props};
  for (const k of textProps) if (typeof out[k] === 'string') out[k] = t(out[k]);
  return out;
}

// Translate text at every depth inside a localized block. The previous
// implementation only translated immediate string children, so text nested
// inside ordinary JSX elements could silently remain English.
const protectedTags = new Set(['code', 'pre', 'kbd', 'textarea', 'script', 'style']);
function translateNode(node, t) {
  if (typeof node === 'string') return t(node);
  // toArray assigns stable React keys to children originating from arrays,
  // preventing missing-key warnings in nested localized JSX blocks.
  if (Array.isArray(node)) return React.Children.toArray(node).map((child) => translateNode(child, t));
  if (!React.isValidElement(node)) return node;

  const tag = typeof node.type === 'string' ? node.type : null;
  if (node.props?.translate === 'no' || (tag && protectedTags.has(tag))) return node;

  const props = propsFor(node.props || {}, t);
  if (Object.hasOwn(props, 'children')) props.children = translateNode(props.children, t);
  return React.cloneElement(node, props);
}
const translateChildren = (children, t) => translateNode(children, t);

export function L({as: tag, children, ...props}) {
  const {locale, t} = useI18n();
  const parent = useContext(Protected);
  const isProtected = parent || props.translate === 'no' || protectedTags.has(tag);
  const out = parent || props.translate === 'no' ? props : propsFor(props, t);
  if (tag === 'a') out.href = localePath(out.href, locale);
  if (tag === 'option' && out.value === undefined && typeof children === 'string') out.value = children;
  const el = React.createElement(tag, out, isProtected ? children : translateChildren(children, t));
  return isProtected && !parent ? <Protected.Provider value={true}>{el}</Protected.Provider> : el;
}
export function Link({href, children, ...props}) {
  const {locale, t} = useI18n();
  return <NextLink {...propsFor(props, t)} href={localePath(href, locale)}>{translateChildren(children, t)}</NextLink>;
}
export function Image(props) { const {t} = useI18n(); return <NextImage {...propsFor(props, t)} />; }