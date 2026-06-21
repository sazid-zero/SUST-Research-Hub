import { uploadLegacyWorkspace } from './app/actions/admin-upload';

async function main() {
    try {
        const formData = new FormData();
        formData.append("type", "publication");
        formData.append("title", "Test Title");
        formData.append("abstract", "Test Abstract");
        formData.append("year", "2024");
        formData.append("status", "approved");
        formData.append("authors", "[]");
        formData.append("keywords", "test");
        
        // Mock a file
        const blob = new Blob(["test"], { type: "application/pdf" });
        const file = new File([blob], "test.pdf", { type: "application/pdf" });
        formData.append("paperFile", file);

        console.log("Calling uploadLegacyWorkspace...");
        const result = await uploadLegacyWorkspace(formData);
        console.log("Result:", result);
    } catch (error) {
        console.error("Caught error:", error);
    }
}

main().catch(console.error);
