import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const moduleSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  code: z.string().min(2, "Le code est obligatoire"),
  formationId: z.string().min(1, "Formation obligatoire"),
  volume: z.string().optional(), // AJOUT
  teacher: z.string().optional(), // AJOUT
});

type Module = {
  id: number;
  name: string;
  code: string;
  formationId: string;
  volume?: string; // AJOUT
  teacher?: string; // AJOUT
};

type Props = {
  onSubmit: (data: {
    name: string;
    code: string;
    formationId: string;
    volume?: string; // AJOUT
    teacher?: string; // AJOUT
  }) => void;
  editingModule: Module | null;
  selectedFormation: string;
};

export default function ModuleForm({
  onSubmit,
  editingModule,
  selectedFormation,
}: Props) {
  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      formationId: selectedFormation,
      volume: "", // AJOUT
      teacher: "", // AJOUT
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
      form.reset();
    },
  });

  useEffect(() => {
    form.setFieldValue("formationId", selectedFormation);
  }, [selectedFormation]);

  useEffect(() => {
    if (editingModule) {
      form.setFieldValue("name", editingModule.name);
      form.setFieldValue("code", editingModule.code);
      form.setFieldValue("formationId", editingModule.formationId);
      form.setFieldValue("volume", editingModule.volume || ""); // AJOUT
      form.setFieldValue("teacher", editingModule.teacher || ""); // AJOUT
    }
  }, [editingModule]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="bg-base-100 p-4 rounded-xl shadow grid grid-cols-2 gap-4"
    >
      <form.Field
        name="name"
        validators={{ onChange: moduleSchema.shape.name }}
      >
        {(field) => (
          <div>
            <label className="block mb-1 font-medium">
              Nom du module
            </label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input input-bordered w-full"
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-error text-sm mt-1">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="code"
        validators={{ onChange: moduleSchema.shape.code }}
      >
        {(field) => (
          <div>
            <label className="block mb-1 font-medium">
              Code du module
            </label>
            <input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input input-bordered w-full"
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-error text-sm mt-1">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* AJOUT Volume horaire */}
      <form.Field name="volume">
        {(field) => (
          <div>
            <label className="block mb-1 font-medium">
              Volume horaire (CM/TD)
            </label>
            <input
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input input-bordered w-full"
              placeholder="ex: 20h CM / 10h TD"
            />
          </div>
        )}
      </form.Field>

      {/* AJOUT Intervenant */}
      <form.Field name="teacher">
        {(field) => (
          <div>
            <label className="block mb-1 font-medium">
              Intervenant responsable
            </label>
            <input
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Nom de l'intervenant"
            />
          </div>
        )}
      </form.Field>

      <button
        type="submit"
        className="btn btn-primary w-full col-span-2"
      >
        {editingModule ? "Mettre à jour" : "Ajouter le module"}
      </button>
    </form>
  );
}