import { FileSignature, ExternalLink, Download, AlertTriangle, FileText } from 'lucide-react';
import { PublicLayout } from '@/shared/layouts/PublicLayout';
import { Button } from '@/shared/components/ui/button';
import { useTranslation } from '@/shared/i18n/useTranslation';

const PDF_PATH = '/documents/Horizon-Truth-Privacy-Clauses-for-Agreements.pdf';

export default function PrivacyClausesPage() {
    const { t } = useTranslation();

    return (
        <PublicLayout>
            <div className="flex flex-col min-h-screen">
                <section className="py-16 bg-primary/5">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <FileSignature className="mx-auto mb-6 text-primary" size={48} />
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4">
                            {t("legal.privacyClausesTitle")}
                        </h1>
                        <p className="text-xl text-muted-foreground opacity-80">
                            {t("legal.privacyClausesSubtitle")}
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="space-y-12">
                            <div className="flex items-start gap-4 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                                <AlertTriangle size={24} className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-2">{t("legal.internalDocument")}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {t("legal.privacyClausesNotice")}
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <h2>{t("legal.aboutThisDocument")}</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t("legal.privacyClausesDesc")}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    size="lg"
                                    className="rounded-2xl px-8 py-6 font-bold text-base"
                                    onClick={() => window.open(PDF_PATH, '_blank', 'noopener,noreferrer')}
                                >
                                    <ExternalLink size={18} className="mr-2" />
                                    {t("legal.viewPdf")}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="rounded-2xl px-8 py-6 font-bold text-base"
                                    asChild
                                >
                                    <a href={PDF_PATH} download="Horizon-Truth-Privacy-Clauses-for-Agreements.pdf">
                                        <Download size={18} className="mr-2" />
                                        {t("legal.downloadPdf")}
                                    </a>
                                </Button>
                            </div>

                            <div className="p-8 bg-secondary/20 rounded-2xl border border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <FileText size={20} className="text-primary" />
                                    <h3 className="font-bold text-lg">{t("legal.documentInfo")}</h3>
                                </div>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    <li><span className="font-semibold text-foreground">{t("legal.type")}:</span> {t("legal.internalContractual")}</li>
                                    <li><span className="font-semibold text-foreground">{t("legal.purpose")}:</span> {t("legal.privacyClausesPurpose")}</li>
                                    <li><span className="font-semibold text-foreground">{t("legal.format")}:</span> PDF</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
