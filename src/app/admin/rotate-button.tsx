import { rotatePhotoAction } from "@/app/admin/actions";
import { SubmitButton } from "@/app/admin/submit-button";

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
 * «Повернуть» — на 90° по часовой стрелке: снимок лёг на бок, нажали — встал
 * как надо (ещё раз — дальше). Отдельная маленькая форма, поэтому ставится
 * рядом с фото, а не внутрь большой формы карточки.
 */
export function RotateButton({ target, id, url }: RotateButtonProps): React.ReactElement {
  return (
    <form action={rotatePhotoAction}>
      <input type="hidden" name="target" value={target} />
      <input type="hidden" name="id" value={id} />
      {url ? <input type="hidden" name="url" value={url} /> : null}
      <SubmitButton className="admin-link-button" pendingLabel="Поворачиваю…">
        Повернуть ↻
      </SubmitButton>
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
      <h2>Обложка сейчас</h2>
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
