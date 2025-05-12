import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { MouseEvent } from "react";

export function LoadingButton({
    isLoading,
    children,
    loadingText,
    onClick

} : {isLoading: boolean , children : React.ReactNode ,
    loadingText : string , onClick? : (e : MouseEvent<HTMLButtonElement>) => void}){

return(
     <Button type="submit"
     onClick={(e) => {
      onClick && onClick?.(e)
     }}
              className="flex gap-1 items-center self-end"
              disabled={isLoading}>
              {isLoading &&
                <Loader2 className="animate-spin" />
              }
    
    
              {isLoading ?
               loadingText : children
              } </Button>
)


}