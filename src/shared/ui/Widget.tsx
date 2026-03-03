import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export function Widget({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3 }}
            style={{ height: "100%" }}
        >
            <Card sx={{ height: "100%" }}>
                <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle1" fontWeight={700} mb={2}>
                        {title}
                    </Typography>
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        {children}
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
}
