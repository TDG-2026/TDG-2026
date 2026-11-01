'use client';
import {L} from '@/lib/i18n/client';
export default function ErrorPage({reset}){return <L as="section" className="section container"><L as="h1">This page could not be loaded.</L><L as="p">Please try again.</L><L as="button" className="btn btn--primary" onClick={reset}>Try again</L></L>;}
