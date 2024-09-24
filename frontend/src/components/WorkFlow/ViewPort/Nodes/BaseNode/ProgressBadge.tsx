/**
 * add node badge component
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Check, ErrorRounded, Sync } from "@mui/icons-material";
import { useWorkSpace } from "@/components/WorkFlow/provider";


/**
 * node badge component
 * @param props 
 * @returns 
 */
export default function ProgressBadge(props: { isValid?: boolean }): React.ReactNode {
    const { isValid } = props;
    const { loading } = useWorkSpace();
    
    switch (true) {
        case (isValid === false):
            return (
                <ErrorRounded
                    fontSize="large"
                    color="error"
                    style={{
                        position: "absolute",
                        top: -12,
                        right: -12,
                    }}
                />
            )

        case (loading === true || loading === 100):
            return (
                <Check
                    fontSize="large"
                    color="success"
                    style={{
                        position: "absolute",
                        top: -12,
                        right: -12,
                    }} />
            )

        case (typeof loading === "number"):
            return (
                <Sync
                    fontSize="large"
                    color="success"
                    style={{
                        position: "absolute",
                        top: -12,
                        right: -12,
                    }} />
            )

        default:
            return <></>

    }

}