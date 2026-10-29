export const getStageFromFollowUp = (fu: any) => {

    if (!fu) return "New";

    // 1. Outcome (highest priority)
    if (fu.outcome === "Answered") return "Answered";
    if (fu.outcome === "Unanswered") return "Unanswered";
    if (fu.outcome === "NotReachable") return "Not Reachable";

    // 2. Next Step
    if (fu.nextStep === "Lost") return "Lost";
    if (fu.nextStep === "CallBack") return "Call Back";
    if (fu.nextStep === "Meeting") return "Meeting";
    if (fu.nextStep === "CreateQuery") return "Query Created";

    // 3. Status
    if (fu.status === "Overdue") return "Overdue";
    if (fu.status === "Pending") return "In Process";

    // Default
    return "In Process";
};