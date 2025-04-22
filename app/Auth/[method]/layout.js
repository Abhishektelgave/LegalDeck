import LoginSwitch from "./components/LoginSwitch";

// Login Layout Page
export default function RootLayout({ children }) {

    return (
        <>
            <LoginSwitch />
            {children}
        </>
    );
};
