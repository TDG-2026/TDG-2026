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
const translateChildren = (children, t) => React.Children.map(children, (c) => (typeof c === 'string' ? t(c) : c));
function propsFor(props, t) { const out = {...props}; for (const k of textProps) if (typeof out[k] === 'string') out[k] = t(out[k]); return out; }

export function L({as: tag, children, ...props}) {
  const {locale, t} = useI18n();
  const parent = useContext(Protected);
  const isProtected = parent || props.translate === 'no' || ['code', 'pre', 'kbd', 'textarea', 'script', 'style'].includes(tag);
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