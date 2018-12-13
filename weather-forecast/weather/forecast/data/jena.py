from typing import Sequence, Optional

import pandas as pd
from torch.utils.data import Dataset


class JenaDataset(Dataset):
    def __init__(self, path: str, columns: Optional[Sequence[str]] = None, transformer: Optional[callable] = None, normalize: bool = True):
        self._columns = columns
        self._transformer = transformer
        self._entries = pd.read_csv(path)
        self._entries['Date Time'] = pd.to_datetime(self._entries['Date Time'])

        if normalize:
            normalized_columns = list(filter(lambda c: 'Date Time' not in c, self._entries.columns))
            for column in normalized_columns:
                c = self._entries[column]
                c = (c - c.mean()) / c.std()
                self._entries[column] = c

        self._entries['Month'] = self._entries['Date Time'].dt.month - 1
        self._entries['Hour'] = self._entries['Date Time'].dt.hour
        self._entries['Minute'] = self._entries['Date Time'].dt.minute

    def __len__(self):
        return self._entries.shape[0]

    def __getitem__(self, index):
        entry = self._entries[self._columns].iloc[index]

        if self._transformer is not None:
            entry = self._transformer(entry)

        return entry

    def stats(self, column):
        col = self._entries[column]
        return col.mean(), col.std()

    @property
    def columns(self):
        return self._entries.columns