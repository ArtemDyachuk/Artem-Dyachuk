// Achievements Utils File

import { Achievement, Company, CompanyWithProcessedAchievements } from "@/types";

export function processAchievementsForCompanies(
    companies: Company[],
    allAchievements: Achievement[]
): CompanyWithProcessedAchievements[] {
    const sortedCompanies = [...companies].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return sortedCompanies.map((company) => {
        const companyAchievements = allAchievements
            .filter((achievement) => achievement.companyId === company.id)
            .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));

        const featuredAchievements = company.achievements
            ? company.achievements
                .map(achievementId =>
                    companyAchievements.find(achievement => achievement.id === achievementId)
                )
                .filter(achievement => achievement !== undefined) as Achievement[]
            : [];

        const otherAchievements = companyAchievements.filter(achievement =>
            !company.achievements?.includes(achievement.id)
        );

        return {
            ...company,
            featuredAchievements,
            otherAchievements,
            allAchievements: companyAchievements,
        };
    });
} 