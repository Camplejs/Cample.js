'use-strict';
export const renderEvents = (element, event, styleClass, reverseEvent) => {
    switch (event) {
        case "toggle":
            element.addEventListener("click",()=>{
                if(element.classList.contains(styleClass)){
                    element.classList.remove(styleClass);
                }else{
                    element.classList.add(styleClass);
                }
            })
            break;
        case "hover":
            element.addEventListener("mouseenter", () => {
                element.classList.add(styleClass);
            });
            element.addEventListener("mouseleave", () => {
                element.classList.remove(styleClass);
            });
            break;
        default:
            element.addEventListener(event, () => {
                element.classList.add(styleClass);
            });
            if (reverseEvent) {
                element.addEventListener(reverseEvent, () => {
                    element.classList.remove(styleClass);
                });
            }
            break;
    }
};
