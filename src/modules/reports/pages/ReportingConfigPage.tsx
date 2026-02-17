import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Languages, Tag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table";
import { reportService, type Language, type ReportTag } from "@/services/report.service";
import { LanguageDialog } from "../components/LanguageDialog";
import { TagDialog } from "../components/TagDialog";

export default function ReportingConfigPage() {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [tags, setTags] = useState<ReportTag[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

    const [tagDialogOpen, setTagDialogOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<ReportTag | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [langsRes, tagsRes] = await Promise.all([
                reportService.getLanguages(true),
                reportService.getReportTags(true)
            ]);
            setLanguages(langsRes.data || []);
            setTags(tagsRes.data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Failed to load configuration data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteLanguage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this language? This action cannot be undone.")) return;
        try {
            await reportService.deleteLanguage(id);
            toast.success("Language deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete language");
        }
    };

    const handleDeleteTag = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tag? Reports using this tag might be affected.")) return;
        try {
            await reportService.deleteReportTag(id);
            toast.success("Tag deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete tag");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight italic uppercase tracking-wider">Reports Configuration</h2>
                <p className="text-muted-foreground mt-1">Manage standard languages and classification tags for reports.</p>
            </div>

            <Tabs defaultValue="languages" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="languages" className="font-bold gap-2">
                        <Languages size={16} />
                        Languages
                    </TabsTrigger>
                    <TabsTrigger value="tags" className="font-bold gap-2">
                        <Tag size={16} />
                        Report Tags
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="languages" className="mt-6 space-y-4">
                    <div className="flex justify-between items-center bg-card border border-border/50 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Languages size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Supported Languages</h3>
                                <p className="text-sm text-muted-foreground">Languages available for report submission and translation.</p>
                            </div>
                        </div>
                        <Button onClick={() => { setSelectedLanguage(null); setLanguageDialogOpen(true); }} className="font-bold">
                            <Plus size={16} className="mr-2" />
                            Add Language
                        </Button>
                    </div>

                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="font-bold uppercase text-xs">Name</TableHead>
                                    <TableHead className="font-bold uppercase text-xs">Code</TableHead>
                                    <TableHead className="font-bold uppercase text-xs">Status</TableHead>
                                    <TableHead className="text-right font-bold uppercase text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                                    </TableRow>
                                ) : languages.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No languages found.</TableCell>
                                    </TableRow>
                                ) : (
                                    languages.map((lang) => (
                                        <TableRow key={lang.id}>
                                            <TableCell className="font-medium">{lang.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-mono text-xs">{lang.code}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={lang.isActive ? "default" : "secondary"} className={lang.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                                    {lang.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => { setSelectedLanguage(lang); setLanguageDialogOpen(true); }}>
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => handleDeleteLanguage(lang.id)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="tags" className="mt-6 space-y-4">
                    <div className="flex justify-between items-center bg-card border border-border/50 p-4 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Tag size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Report Tags</h3>
                                <p className="text-sm text-muted-foreground">Categories used to classify and filter reports.</p>
                            </div>
                        </div>
                        <Button onClick={() => { setSelectedTag(null); setTagDialogOpen(true); }} className="font-bold">
                            <Plus size={16} className="mr-2" />
                            Add Tag
                        </Button>
                    </div>

                    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="font-bold uppercase text-xs">Name</TableHead>
                                    <TableHead className="font-bold uppercase text-xs">Slug</TableHead>
                                    <TableHead className="font-bold uppercase text-xs">Status</TableHead>
                                    <TableHead className="text-right font-bold uppercase text-xs">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell>
                                    </TableRow>
                                ) : tags.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No tags found.</TableCell>
                                    </TableRow>
                                ) : (
                                    tags.map((tag) => (
                                        <TableRow key={tag.id}>
                                            <TableCell className="font-medium">{tag.name}</TableCell>
                                            <TableCell>
                                                <code className="text-xs bg-muted px-1 py-0.5 rounded">{tag.slug}</code>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={tag.isActive ? "default" : "secondary"} className={tag.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}>
                                                    {tag.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => { setSelectedTag(tag); setTagDialogOpen(true); }}>
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => handleDeleteTag(tag.id)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            <LanguageDialog
                open={languageDialogOpen}
                onOpenChange={setLanguageDialogOpen}
                language={selectedLanguage}
                onSuccess={fetchData}
            />

            <TagDialog
                open={tagDialogOpen}
                onOpenChange={setTagDialogOpen}
                tag={selectedTag}
                onSuccess={fetchData}
            />
        </div>
    );
}
