import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const moduleSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  code: z.string().min(2, "Le code est obligatoire"),
  formationId: z.string().min(1, "Formation obligatoire"),
  volume: z.string().optional(),
});

type Module = {
  id: string;
  name: string;
  code: string;
  formationId?: string;
  volume?: string;
};

type Props = {
  onSubmit: (data: {
    name: string;
    code: string;
    formationId: string;
    volume?: string;
  }) => void | Promise<void>;
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
      volume: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
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
      form.setFieldValue(
        "formationId",
        editingModule.formationId || selectedFormation
      );
      form.setFieldValue("volume", editingModule.volume || "");
    }
  }, [editingModule, selectedFormation]);

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
              disabled={!!editingModule}
              className="input input-bordered w-full disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-error text-sm mt-1">
                {field.state.meta.errors[0]?.message}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="volume">
        {(field) => (
          <div className="col-span-2">
            <label className="block mb-1 font-medium">
              Volume horaire (CM/TD)
            </label>
            <input
              value={field.state.value || ""}
              onChange={(e) => field.handleChange(e.target.value)}
              className="input input-bordered w-full"
              placeholder="En attente de Assign"
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