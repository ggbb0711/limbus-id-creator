import React from "react";
import Spinner from "components/ui/spinner/Spinner";

export default function Loading() {
    return <div className="page-container">
        <div className="page-content post-img-loader">
            <Spinner/>
        </div>
    </div>
}
