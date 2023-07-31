import Link from "next/link";
import style from "./style.module.scss";

function Footer() {
    return (
        <footer className={style.footer}>
            <Link style={{ textDecoration: "underline" }} href="https://github.com/mk360/sf6-damage-calc">GitHub</Link> - <Link style={{ textDecoration: "underline" }} href="https://discord.gg/xJncHU9K">Discord</Link>
        </footer>
    )
};

export default Footer;
