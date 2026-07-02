import { contrastText } from "../lib/color";
import { generateUiColorsScale } from "../lib/uicolors";
import { SavedPalette } from "../lib/storage";

interface MyPalettesPageProps {
  saved: SavedPalette[];
  onLoad: (palette: SavedPalette) => void;
  onDelete: (id: string) => void;
}

export function MyPalettesPage({ saved, onLoad, onDelete }: MyPalettesPageProps) {
  return (
    <div className="page">
      <div className="page-intro">
        <h1>My palettes</h1>
        <p>
          Palettes you save live here — stored locally in your browser, no account needed.
        </p>
      </div>
      {saved.length === 0 ? (
        <div className="empty-state">
          <strong>No saved palettes yet</strong>
          <p>Hit ♡ Save on the Generate page and your palettes will show up here.</p>
        </div>
      ) : (
        <div className="saved-list">
          {saved.map((item) => {
            const scale = generateUiColorsScale(item.seedHex);
            return (
              <section key={item.id} className="saved-card">
                <div className="saved-head">
                  <div>
                    <h2>{item.name}</h2>
                    <em>
                      {item.seedHex.toUpperCase()}
                      {item.overrides.secondary ? ` + ${item.overrides.secondary.toUpperCase()}` : ""}
                      {" · "}
                      {new Date(item.savedAt).toLocaleDateString()}
                    </em>
                  </div>
                  <div className="saved-actions">
                    <button className="btn btn-ghost" onClick={() => onLoad(item)}>Load</button>
                    <button className="btn btn-ghost saved-delete" onClick={() => onDelete(item.id)}>Delete</button>
                  </div>
                </div>
                <div className="swatch-strip saved-strip">
                  {scale.colors.map(({ stop, hex }) => (
                    <span key={stop} className="swatch" style={{ background: hex, color: contrastText(hex) }}>
                      <span className="swatch-stop">{stop}</span>
                    </span>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
