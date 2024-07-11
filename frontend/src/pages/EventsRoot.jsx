import EventsNavigation from "../components/EventsNavigation.jsx";
import {Outlet} from "react-router-dom";

const EventsRootLayout  = () => {
    return (
        <>
            <EventsNavigation />
            <Outlet />
        </>
    )
}

export default EventsRootLayout;
