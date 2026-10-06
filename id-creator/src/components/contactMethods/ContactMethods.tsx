import React, { ReactElement } from "react";
import DiscordIcon from "assets/icons/DiscordIcon";
import { SITE_LINKS, mailtoLink } from "config/siteLinks";
import CopyButton from "./CopyButton";

export default function ContactMethods({ classPrefix }: { classPrefix: string }): ReactElement {
    return <div className={`${classPrefix}-methods`}>
        <div className={`${classPrefix}-method`}>
            <span className={`${classPrefix}-method-icon`} aria-hidden="true">✉</span>
            <a href={mailtoLink()}>{SITE_LINKS.contactEmail}</a>
        </div>
        <div className={`${classPrefix}-method`}>
            <span className={`${classPrefix}-method-icon`} aria-hidden="true">
                <DiscordIcon />
            </span>
            <span>{SITE_LINKS.discordHandle}</span>
            <CopyButton text={SITE_LINKS.discordHandle} label="Copy Discord username"/>
        </div>
    </div>
}
