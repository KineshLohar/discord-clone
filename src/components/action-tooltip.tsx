import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";


interface ActionTooltipProps {
    label: string;
    side: 'top' | 'left' | 'right' | 'bottom';
    align: 'start' | 'center' | 'end';
    children: React.ReactNode

}

export const ActionTooltip = ({
    label,
    side,
    align,
    children
}: ActionTooltipProps) => {

    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">{label.toLocaleLowerCase()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}