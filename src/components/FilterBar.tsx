import { inputClass, labelClass, primaryButtonClass } from "@/components/ui/styles";

export type CatalogFilters = {
  type?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  q?: string;
  sort?: string;
};

export function FilterBar({ filters }: { filters: CatalogFilters }) {
  return (
    <form method="get" action="/imoveis" className="card-elevated grid gap-4 rounded-2xl p-5 sm:grid-cols-6">
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="q">Buscar</label>
        <input className={inputClass} id="q" name="q" placeholder="Título, bairro..." defaultValue={filters.q} />
      </div>
      <div>
        <label className={labelClass} htmlFor="type">Tipo</label>
        <select id="type" name="type" defaultValue={filters.type ?? ""} className={inputClass}>
          <option value="">Todos</option>
          <option value="venda">Venda</option>
          <option value="aluguel">Aluguel</option>
          <option value="lancamento">Lançamento</option>
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="city">Cidade</label>
        <input className={inputClass} id="city" name="city" defaultValue={filters.city} />
      </div>
      <div>
        <label className={labelClass} htmlFor="minPrice">Preço mín.</label>
        <input className={inputClass} id="minPrice" name="minPrice" type="number" defaultValue={filters.minPrice} />
      </div>
      <div>
        <label className={labelClass} htmlFor="maxPrice">Preço máx.</label>
        <input className={inputClass} id="maxPrice" name="maxPrice" type="number" defaultValue={filters.maxPrice} />
      </div>
      <div>
        <label className={labelClass} htmlFor="bedrooms">Quartos (mín.)</label>
        <input className={inputClass} id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={filters.bedrooms} />
      </div>
      <div>
        <label className={labelClass} htmlFor="sort">Ordenar por</label>
        <select id="sort" name="sort" defaultValue={filters.sort ?? "recentes"} className={inputClass}>
          <option value="recentes">Mais recentes</option>
          <option value="menor-preco">Menor preço</option>
          <option value="maior-preco">Maior preço</option>
        </select>
      </div>
      <div className="flex items-end sm:col-span-6">
        <button type="submit" className={primaryButtonClass}>Filtrar</button>
      </div>
    </form>
  );
}
