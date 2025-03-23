"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { serviceTypes } from '@/utils/serviceTypes'
import { useSetSelectedServiceType } from '@/hooks/states'
import { useRouter } from 'next/navigation'
import { useIsTokenAccepted } from '@/hooks/interact/TokenContract'
import ReactLoading from 'react-loading'

export default function ServiceSelection() {
    const [hoveredService, setHoveredService] = useState<string | null>(null)
    const setSelectedServiceType = useSetSelectedServiceType()
    const router = useRouter()
    const isChainPayTokenAccepted = useIsTokenAccepted().isAccepted
    const [isLoading, setIsLoading] = useState(true)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
        hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } }
    }

    setTimeout(() => {
        setIsLoading(false)
    }, 1000)

    return (
        <div className="flex flex-col items-center w-full rounded-xl mb-4 px-4">
            <div className="max-w-5xl w-full">
                <div className="w-full flex items-center justify-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        <h2 className="text-xl md:text-2xl font-bold text-center relative z-10">
                            <span className="bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark text-transparent bg-clip-text">
                                Choose a Service
                            </span>
                        </h2>
                        <motion.div 
                            className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-chainpay-blue via-chainpay-orange to-chainpay-blue-dark rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                        />
                    </motion.div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center w-full min-h-[400px]">
                        <ReactLoading type="cylon" color="#0088CC" height={50} width={50} />
                    </div>
                ) : (
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {serviceTypes.map((service) => (
                            <motion.div
                                key={service.id}
                                variants={itemVariants}
                                whileHover="hover"
                                onHoverStart={() => setHoveredService(service.id)}
                                onHoverEnd={() => setHoveredService(null)}
                                onClick={() => { 
                                    setSelectedServiceType(service.id);
                                    router.push(`/bill-payment/${service.id.toLowerCase()}`);
                                }}
                                className="relative overflow-hidden rounded-xl p-5 cursor-pointer"
                            >
                                {/* Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-chainpay-blue-light/10 dark:from-gray-900 dark:to-gray-800 shadow-md border border-chainpay-blue/20" />
                                
                                {/* Hover effect */}
                                <AnimatePresence>
                                    {hoveredService === service.id && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-gradient-to-br from-chainpay-blue-light/20 to-chainpay-blue/30 dark:from-blue-900/40 dark:to-blue-800/60"
                                        />
                                    )}
                                </AnimatePresence>
                                
                                {/* Glow effect on hover */}
                                <AnimatePresence>
                                    {hoveredService === service.id && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.6 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute -inset-1 blur-lg rounded-xl"
                                            style={{
                                                background: `linear-gradient(45deg, ${service.id === 'AIRTIME' ? '#FFAA00' : '#0088CC'}, ${service.id === 'AIRTIME' ? '#0088CC' : '#FFAA00'})`,
                                                zIndex: -1
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                                
                                <div className="flex flex-col items-center relative z-10">
                                    <div className="mb-4 rounded-full bg-white/90 dark:bg-gray-800/90 p-3 shadow-sm border border-chainpay-blue-light/20">
                                        <Image 
                                            src={service.icon} 
                                            alt={service.label} 
                                            width={40} 
                                            height={40}
                                            className="h-8 w-8 object-contain" 
                                        />
                                    </div>
                                    <h3 className="text-base font-semibold mb-1 text-chainpay-blue-dark dark:text-blue-300">{service.label}</h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{service.description}</p>
                                    
                                    {/* Badge for most used service */}
                                    {service.id === 'AIRTIME' && (
                                        <motion.div 
                                            className="absolute -top-1 -right-1 bg-gradient-to-r from-chainpay-orange to-chainpay-orange-dark text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-md"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.5, type: "spring" }}
                                        >
                                            Popular
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="w-full flex justify-center mt-8"
                >
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-chainpay-blue to-chainpay-blue-dark text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => router.push('/transactions')}
                    >
                        <span>View Transaction History</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </motion.div>
            </div>
        </div>
    )
} 