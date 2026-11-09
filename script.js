        // O plano básico de R$ 99,90 já inclui Estoque, 1 PDV e emissão fiscal.
        // PDV adicional é cobrado somente quando o cliente precisa de outro ponto de venda.
        const BASE_PRICE = 99.90;
        const modules = [
            ["PDV Adicional", 12, 39.90],
            ["Vendas", 23, 99.90],
            ["Boleto", 12, 29.90],
            ["Clínica", 60, 149.90],
            ["Compras", 12, 29.90],
            ["Contabilidade", 250, 499.90],
            ["CT-e", 12, 39.90],
            ["Delivery", 80, 179.90],
            ["E-commerce", 0, 99.90],
            ["E-commerce Próprio", 40, 99.90],
            ["Financeiro", 23, 49.90],
            ["Força de Vendas", 12, 49.90],
            ["GrandChef", 0, 69.90],
            ["MDF-e", 12, 39.90],
            ["Mentora Food", 0, 49.90],
            ["NFS-e", 12, 39.90],
            ["PDV Mobile", 0, 59.90],
            ["Petshop", 0, 99.90],
            ["Salão", 0, 99.90],
            ["SPED", 0, 49.90],
            ["WhatsApp", 15, 49.90]
        ];
        const selected = new Set();
        const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        const container = document.getElementById("modules");
        function render() {
            const term = document.getElementById("search").value.trim().toLocaleLowerCase("pt-BR");
            const shown = modules.map((m, i) => ({ m, i })).filter(x => x.m[0].toLocaleLowerCase("pt-BR").includes(term));
            container.innerHTML = "";
            if (!shown.length) { container.innerHTML = '<div class="empty">Nenhum módulo encontrado.</div>'; return; }
            shown.forEach(({ m, i }) => {
                const label = document.createElement("label"); label.className = "item";
                const cb = document.createElement("input"); cb.type = "checkbox"; cb.checked = selected.has(i);
                cb.addEventListener("change", () => { cb.checked ? selected.add(i) : selected.delete(i); update(); });
                const name = document.createElement("span"); name.className = "name"; name.textContent = m[0];
                const price = document.createElement("span"); price.className = "price"; price.textContent = brl(m[2]);
                label.append(cb, name, price); container.append(label);
            });
        }
        function totals() {
            let addons = 0; selected.forEach(i => addons += modules[i][2]);
            return { addons, total: BASE_PRICE + addons };
        }
        function update() {
            const t = totals();
            document.getElementById("total").textContent = brl(t.total);
            document.getElementById("addons").textContent = brl(t.addons);
            document.getElementById("count").textContent = selected.size;
            render();
        }
        document.getElementById("all").addEventListener("click", () => { modules.forEach((_, i) => selected.add(i)); update(); });
        document.getElementById("clear").addEventListener("click", () => { selected.clear(); update(); });
        document.getElementById("search").addEventListener("input", render);
        document.getElementById("copy").addEventListener("click", async () => {
            const t = totals();
            const lines = [...selected].sort((a, b) => a - b).map(i => `${modules[i][0]} - ${brl(modules[i][2])}`);
            const message = ["ORÇAMENTO | DIALOGA TECH", "", "Plano básico (Estoque + 1 PDV + emissão fiscal) - " + brl(BASE_PRICE), ...lines, "", `TOTAL MENSAL: ${brl(t.total)}`].join("\n");
            try { await navigator.clipboard.writeText(message); alert("Orçamento copiado! Agora é só colar no WhatsApp."); }
            catch (e) { const ta = document.createElement("textarea"); ta.value = message; document.body.append(ta); ta.select(); document.execCommand("copy"); ta.remove(); alert("Orçamento copiado! Agora é só colar no WhatsApp."); }
        });
        update();