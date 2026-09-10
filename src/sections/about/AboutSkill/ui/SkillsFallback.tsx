import Image from "next/image";
import { classNames } from "@/shared/lib/classNames";
import styles from "./SkillsFallback.module.scss";
import { SKILLS } from "../utils/skills";

type SkillsFallbackProps = {
    visuallyHidden?: boolean;
};

const SkillsFallback = ({ visuallyHidden = false }: SkillsFallbackProps) => (
    <ul
        className={classNames(
            styles["skills-fallback"],
            visuallyHidden && styles["skills-fallback--hidden"]
        )}
    >
        {SKILLS.map((skill) => (
            <li key={skill.name} className={styles["skills-fallback__item"]}>
                {!visuallyHidden && (
                    <Image src={skill.icon} alt="" width={32} height={32} aria-hidden="true" />
                )}
                <span>{skill.name}</span>
            </li>
        ))}
    </ul>
);

export default SkillsFallback;
