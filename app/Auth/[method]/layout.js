import LoginSwitch from "./components/LoginSwitch";
import LoginLayout from "./components/LoginLayout"

// Login Layout Page
export default function RootLayout({ children }) {
    return <>
        <LoginLayout >
            <LoginSwitch />
            {children}
        </LoginLayout>
    </>;
}
