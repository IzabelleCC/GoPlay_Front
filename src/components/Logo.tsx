import { Image } from "native-base";
import LogoImg from "../assets/logo.png";

export function Logo() {
    return <Image source={LogoImg} alt="Logo GoPlay" width={249} height={264} />;
}
