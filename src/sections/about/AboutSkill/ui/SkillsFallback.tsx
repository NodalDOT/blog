import Image from "next/image";
import styles from "./SkillsFallback.module.scss";
import { SKILLS } from "../utils/sphereUtils";

const SkillsFallback = () => (
    <ul className={styles["skills-fallback"]}>
        {SKILLS.map((skill) => (
            <li key={skill.name} className={styles["skills-fallback__item"]}>
                <Image src={skill.icon} alt="" width={32} height={32} aria-hidden="true" />
                <span>{skill.name}</span>
            </li>
        ))}
    </ul>
);

export default SkillsFallback;
