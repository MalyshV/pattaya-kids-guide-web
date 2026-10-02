import { rotatePhotoAction } from "@/app/admin/actions";
import { RotateControls } from "@/app/admin/rotate-controls";

export type RotateTarget =
  | "placePhoto"
  | "placeCover"
  | "eventCover"
  | "activityCover"
  | "submissionPhoto";

type RotateButtonProps = {
  target: RotateTarget;
  /** id фото галереи, карточки (для обложки) или предложения */
  id: string;
  /** для фото предложения — какое именно */
  url?: string;
};

/**
 * Поворот на 90° в обе стороны: ↺ против часовой, ↻ по часовой — снимок лёг
 * на бок, нажали — встал как надо. Отдельная маленькая форма, поэтому
 * ставится рядом с фото, а не внутрь большой формы карточки. После поворота
 * попапа нет: фото просто меняется на глазах (решение Вероники 02.10).
 */
export function RotateButton({ target, id, url }: RotateButtonProps): React.ReactElement {
  return (
    <form action={rotatePhotoAction}>
      <input type="hidden" name="target" value={target} />
      <input type="hidden" name="id" value={id} />
      {url ? <input type="hidden" name="url" value={url} /> : null}
      <RotateControls />
    </form>
  );
}

type CoverPreviewProps = {
  target: "placeCover" | "eventCover" | "activityCover";
  id: string;
  imageUrl: string | null;
};

/** Текущая обложка карточки с кнопкой поворота — под основной формой. */
export function CoverPreview({
  target,
  id,
  imageUrl,
}: CoverPreviewProps): React.ReactElement | null {
  if (!imageUrl) {
    return null;
  }
  return (
    <>
      <hr className="admin-divider" />
      <h2 id="cover">Обложка сейчас</h2>
      <ul className="admin-photo-grid">
        <li className="admin-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" loading="lazy" />
          <RotateButton target={target} id={id} />
        </li>
      </ul>
      <p className="admin-muted">
        Поворот сохраняется сразу. Несохранённые правки в форме выше при этом пропадут —
        сначала нажмите «Сохранить».
      </p>
    </>
  );
}
