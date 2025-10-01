import { motion, AnimatePresence } from "framer-motion";
const Modal = ({ children }) => {
    return (
        <div className="fixed inset-0 w-full h-screen z-100 backdrop-blur-sm bg-black/80 flex justify-center items-center">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                   
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Modal